import { Router } from "express";
import Anthropic from "@anthropic-ai/sdk";
import crypto from "crypto";
import { getCredits, hasCredits, useCredit, getFreeCredits, AI_CREDIT_PRICE, PAID_CREDITS } from "../bot/aiCreditStore";
import { recordEvent } from "../bot/statsStore";
import { logger } from "../lib/logger";

const router = Router();

const LEGAL_SYSTEM_PROMPT = `Siz "Qozibuva AI" — O'zbekiston milliy qonunchiligi bo'yicha professional huquqiy maslahatchi tizimisiz.

MAJBURIY QOIDALAR:
1. FAQAT O'zbekiston amaldagi qonunchiligi asosida javob bering (lex.uz manbasi)
2. Kuchini yo'qotgan, bekor qilingan yoki eskirgan normalar asosida JAVOB BERMANG — faqat hozir amaldagi tahrir bo'yicha tahlil qiling
3. Huquqiy masalaga bevosita aloqasi bo'lmagan savollarga: "Ushbu savol huquqiy maslahat doirasidan tashqarida" deb rad eting
4. Javob hissiyotsiz, qisqa, aniq va professional bo'lsin — ortiqcha so'z ishlatmang
5. Qonuniy asoslarni aniq ko'rsating: qonun nomi, modda raqami, qism va bandi
6. Imkon boricha O'zbekiston sud amaliyotiga bog'lang
7. Kerakli huquqiy tadbirlarni aniq ko'rsating
8. Javob o'zbek tilida bo'lsin
9. Maqtov, uzr so'rash yoki his-tuyg'uli murojaat qilmasdan to'g'ridan-to'g'ri professional javob bering
10. JAVOBDA EMOTIKONLAR VA BO'LIMLAR BOSHLAGICHLAR ISHLATILMASIN (⚖️, 📜, 🏛, 📋, ⚠️, ---, ** va shunga o'xshash bezaklar yo'q)
11. Javob matniga bo'limlar qo'shilsa ham, faqat oddiy sarlavhalar bilan (masalan: "Huquqiy tahlil:", "Qonuniy asos:"), emotikon va chiziqlarsiz
12. Javob qat'iy yuridik-huquqiy uslubda, rasmiy hujjatga o'xshash, lekin tushunarli bo'lsin

JAVOB FORMATI (professional, tekis uslub):
[Holat qisqacha baholash]

[Qonuniy asos: qonun nomi, modda raqami, qism va bandi]

[Sud amaliyoti — agar mavjud bo'lsa]

[Huquqiy tadbirlar: nima qilish kerak, tartib bo'yicha]

[Muhim eslatmalar: muddatlar, xavflar va boshqa nuances]`;

const DISCLAIMER = `Ushbu javob AI tomonidan tayyorlangan huquqiy ma'lumot bo'lib, faqat yo'naltiruvchi xususiyatga ega. Muhim qarorlar uchun malakali yurist bilan maslahatlashing.`;

function validateInitData(initData: string, botToken: string): number | null {
  try {
    const params = new URLSearchParams(initData);
    const hash = params.get("hash");
    if (!hash) return null;

    params.delete("hash");
    const dataCheckString = [...params.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join("\n");

    const secretKey = crypto.createHmac("sha256", "WebAppData").update(botToken).digest();
    const expectedHash = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

    if (expectedHash !== hash) return null;

    const userStr = params.get("user");
    if (!userStr) return null;
    const user = JSON.parse(userStr) as { id: number };
    return user.id;
  } catch {
    return null;
  }
}

router.post("/ai/chat", async (req, res) => {
  const { question, initData } = req.body as {
    question?: string;
    initData?: string;
  };

  if (!question || typeof question !== "string" || question.trim().length === 0) {
    res.status(400).json({ error: "question_required" });
    return;
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN ?? "";
  let userId: number | null = null;

  if (initData && botToken) {
    userId = validateInitData(initData, botToken);
  }

  // Dev rejimida (Railway'da emas) initData bo'lmasa ham ruxsat berish
  if (!userId && process.env.NODE_ENV !== "production") {
    userId = 0;
  }

  if (!userId && userId !== 0) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }

  if (!hasCredits(userId)) {
    res.status(402).json({
      error: "no_credits",
      creditsLeft: 0,
      buyInfo: {
        price: AI_CREDIT_PRICE,
        credits: PAID_CREDITS,
      },
    });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(503).json({ error: "ai_not_configured" });
    return;
  }

  try {
    const anthropic = new Anthropic({ apiKey });
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: LEGAL_SYSTEM_PROMPT,
      messages: [{ role: "user", content: question.trim() }],
    });

    const block = response.content[0];
    const answer = block?.type === "text" ? block.text : "Natija olinmadi.";

    const wasFree = getFreeCredits(userId) > 0;
    useCredit(userId);
    recordEvent(userId, "ai_question", wasFree ? "free" : "paid");
    const creditsLeft = getCredits(userId);

    logger.info({ userId, creditsLeft }, "Mini app AI savol javoblandi");
    res.json({ answer, creditsLeft, disclaimer: DISCLAIMER });
  } catch (err) {
    logger.error({ err, userId }, "Mini app AI xato");
    res.status(500).json({ error: "ai_error" });
  }
});

export default router;
