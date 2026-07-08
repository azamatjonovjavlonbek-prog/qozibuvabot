import TelegramBot from "node-telegram-bot-api";
import Anthropic from "@anthropic-ai/sdk";
import { backToMainKeyboard } from "./keyboards";
import { logger } from "../lib/logger";
import type { Lang } from "./userProfile";
import { useCredit, getCredits } from "./aiCreditStore";

function getAnthropicClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY_NOT_SET");
  return new Anthropic({ apiKey });
}

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

JAVOB FORMATI:
⚖️ Huquqiy tahlil:
[holat qisqacha baholash]

📜 Amaldagi qonuniy asos:
[qonun nomi — XX-modda, X-qism, X-band]

🏛 Sud amaliyoti:
[agar mavjud bo'lsa — tegishli holat]

📋 Kerakli huquqiy qadamlar:
[nima qilish kerak, tartib bo'yicha]

⚠️ Muhim eslatma:
[xavflar, muddatlar yoki boshqa nuances]`;

function splitMessage(text: string, maxLen: number): string[] {
  const parts: string[] = [];
  let remaining = text;
  while (remaining.length > maxLen) {
    let cut = remaining.lastIndexOf("\n", maxLen);
    if (cut < maxLen / 2) cut = maxLen;
    parts.push(remaining.slice(0, cut));
    remaining = remaining.slice(cut).trimStart();
  }
  if (remaining) parts.push(remaining);
  return parts;
}

export async function handleAiLegalQuestion(
  bot: TelegramBot,
  userId: number,
  chatId: number,
  lang: Lang,
  question: string,
): Promise<void> {
  const processingMsg = await bot.sendMessage(chatId,
    lang === "cyrillic"
      ? "⚖️ *Ҳуқуқий таҳлил амалга оширилмоқда...* Бироз кутинг."
      : "⚖️ *Huquqiy tahlil amalga oshirilmoqda...* Biroz kuting.",
    { parse_mode: "Markdown" }
  );

  try {
    const anthropic = getAnthropicClient();
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: LEGAL_SYSTEM_PROMPT,
      messages: [{ role: "user", content: question }],
    });

    const block = response.content[0];
    const answer = block.type === "text" ? block.text : "Natija olinmadi.";

    await bot.deleteMessage(chatId, processingMsg.message_id).catch(() => {});

    useCredit(userId);
    const remaining = getCredits(userId);

    const creditNote = remaining > 0
      ? (lang === "cyrillic"
          ? `\n\n💳 Қолган кредитлар: *${remaining} та* | Яна савол бериш учун хабар юборинг.`
          : `\n\n💳 Qolgan kreditlar: *${remaining} ta* | Yana savol berish uchun xabar yuboring.`)
      : (lang === "cyrillic"
          ? `\n\n⚠️ *Кредитларингиз тугади.* Давом этиш учун /ai буйруғини юборинг.`
          : `\n\n⚠️ *Kreditlaringiz tugadi.* Davom etish uchun /ai buyrug'ini yuboring.`);

    const disclaimer = lang === "cyrillic"
      ? `\n\n---\n_⚠️ Ушбу жавоб AI томонидан тайёрланган ҳуқуқий маълумот бўлиб, фақат йўналтирувчи хусусиятга эга. Муҳим қарорлар учун малакали юрист билан маслаҳатлашинг._`
      : `\n\n---\n_⚠️ Ushbu javob AI tomonidan tayyorlangan huquqiy ma'lumot bo'lib, faqat yo'naltiruvchi xususiyatga ega. Muhim qarorlar uchun malakali yurist bilan maslahatlashing._`;

    const fullMessage = answer + creditNote + disclaimer;
    const chunks = splitMessage(fullMessage, 4000);

    for (let i = 0; i < chunks.length; i++) {
      const isLast = i === chunks.length - 1;
      await bot.sendMessage(chatId, chunks[i]!, {
        parse_mode: "Markdown",
        reply_markup: isLast ? backToMainKeyboard(lang) : undefined,
      });
    }

    logger.info({ userId, remaining }, "Qozibuva AI savol muvaffaqiyatli javoblandi");
  } catch (err) {
    logger.error({ err, userId }, "Qozibuva AI da xato");
    await bot.deleteMessage(chatId, processingMsg.message_id).catch(() => {});

    const isNoKey = err instanceof Error && err.message === "ANTHROPIC_API_KEY_NOT_SET";
    const errText = isNoKey
      ? (lang === "cyrillic"
          ? "⚙️ *AI xizmati hali sozlanmagan.*\n\nAdministrator `ANTHROPIC_API_KEY` ni Railway'ga qo'shishi kerak.\n\nQo'llanma: console.anthropic.com → API Keys → yangi kalit oling → Railway → Variables → `ANTHROPIC_API_KEY` ga kiriting."
          : "⚙️ *AI xizmati hali sozlanmagan.*\n\nAdministrator `ANTHROPIC_API_KEY` ni Railway'ga qo'shishi kerak.\n\nQo'llanma: console.anthropic.com → API Keys → yangi kalit oling → Railway → Variables → `ANTHROPIC_API_KEY` ga kiriting.")
      : (lang === "cyrillic"
          ? "❌ Xatolik yuz berdi. Biroz kutib, qaytadan urinib ko'ring."
          : "❌ Xatolik yuz berdi. Biroz kutib, qaytadan urinib ko'ring.");

    await bot.sendMessage(chatId, errText,
      { parse_mode: "Markdown", reply_markup: backToMainKeyboard(lang) }
    );
  }
}
