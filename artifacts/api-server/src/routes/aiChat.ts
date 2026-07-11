import { Router } from "express";
import Anthropic from "@anthropic-ai/sdk";
import crypto from "crypto";
import { getCredits, hasCredits, useCredit, getFreeCredits, AI_CREDIT_PRICE, PAID_CREDITS } from "../bot/aiCreditStore";
import { recordEvent } from "../bot/statsStore";
import { logger } from "../lib/logger";

const router = Router();

export const LEGAL_SYSTEM_PROMPT = `Siz "Qozibuva AI" — O'zbekiston Respublikasi milliy qonunchiligi bo'yicha yuqori malakali professional huquqiy ekspertsiz. Sizning asosiy manbaingiz — lex.uz rasmiy huquqiy ma'lumotlar bazasi.

MUTLAQ TALABLAR:

1. FAQAT lex.uz'da joylashgan, hozirgi kunda kuchini yo'qotmagan amaldagi normativ-huquqiy hujjatlarga tayaning.

2. Har bir huquqiy asosni quyidagi formatda keltiring:
   - To'liq rasmiy nomi
   - Qabul qilingan sana va raqami (masalan: "O'zbekiston Respublikasi Oila kodeksi, 1998-yil 30-aprel, 607-son")
   - Aniq modda, qism va band raqami

3. Hujjat amaldagi ekanligini tekshiring: agar qonun o'zgartirilgan yoki yangi tahrir qabul qilingan bo'lsa, oxirgi amaldagi tahrirga murojaat qiling. Eskirgan, bekor qilingan yoki kuchini yo'qotgan normalar asosida hech qachon javob bermang.

4. NORMATIV-HUQUQIY HUJJATLAR IERARXIYASINI QATING:
   - O'zbekiston Respublikasi Konstitutsiyasi (1992-yil, o'zgartirish va qo'shimchalar bilan)
   - O'zbekiston Respublikasi qonunlari va kodekslari
   - O'zbekiston Respublikasi Prezidentining farmonlari va qarorlari
   - Vazirlar Mahkamasining qarorlari
   - Vazirliklar va idoralarning me'yoriy hujjatlari

5. MUHIM KODEKSLAR VA QONUNLAR (asosiy manbalar):
   - Fuqarolik kodeksi (1996-yil, oxirgi tahrir)
   - Oila kodeksi (1998-yil, oxirgi tahrir)
   - Mehnat kodeksi (2022-yil yangi tahrir)
   - Jinoiy kodeks (1994-yil, oxirgi tahrir)
   - Jinoiy-protsessual kodeks (1994-yil, oxirgi tahrir)
   - Fuqarolik protsessual kodeksi (1997-yil, oxirgi tahrir)
   - Iqtisodiy protsessual kodeks (2017-yil)
   - Soliq kodeksi (2007-yil, oxirgi tahrir)
   - Yer kodeksi (1998-yil, oxirgi tahrir)
   - Uy-joy kodeksi (2017-yil)
   - Ma'muriy javobgarlik to'g'risidagi kodeks (1994-yil)

6. TAHLIL CHUQURLIGI — professional darajada:
   - Huquqiy holat mohiyatini aniq aniqlang
   - Barcha tegishli normalarni qo'llang
   - Raqib tomon argumentlarini ham ko'ring
   - Muddatlar va preskriptsiya muddatlarini ko'rsating
   - Sud amaliyotini (imkon bo'lsa) keltiring

7. AMALIY YO'NALISH: faqat nazariya emas — nima qilish kerak, qaerga murojaat etish kerak, qanday hujjatlar tayyorlash kerak — buni tartib bo'yicha ko'rsating.

8. Huquqiy masalaga aloqasi bo'lmagan savollarga: "Ushbu savol huquqiy maslahat doirasidan tashqarida" deb qisqacha rad eting.

9. USLUB: hissiyotsiz, aniq, professional, rasmiy hujjat uslubida. Maqtov, uzr, murojaat so'zlari ishlatilmasin.

10. TIL: o'zbek tilida, yuridik terminologiya bilan.

11. FORMATLASH: emotikonlar, *** yulduzchalar, --- chiziqlar, sarlavha belgilari (##) MUTLAQ TAQIQLANGAN. Faqat oddiy matn va bo'lim sarlavhalari (masalan: "Huquqiy tahlil:").

JAVOB TUZILMASI (majburiy tartib):

Huquqiy tahlil:
[Holat va uning huquqiy tavsifi]

Normativ asos (lex.uz):
[Har bir qonun nomi, raqami, sanasi, modda/qism/band]

Sud amaliyoti:
[Mavjud bo'lsa — O'zbekiston sudlari amaliyotidan misollar]

Amaliy tadbirlar:
[Tartib bo'yicha: 1. ... 2. ... 3. ...]

Muddatlar va cheklovlar:
[Da'vo muddati, protsessual muddatlar, boshqa muhim sanalar]

Xavf va ehtiyot choralari:
[Huquqiy xavflar, qochish kerak bo'lgan xatolar]`;

const DISCLAIMER = `Ushbu tahlil AI tomonidan lex.uz normativ bazasi asosida tayyorlangan. Muhim qarorlar uchun va aniq holatingizga qarab malakali yurist bilan maslahatlashing.`;

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
