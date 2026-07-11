import TelegramBot from "node-telegram-bot-api";
import Anthropic from "@anthropic-ai/sdk";
import { backToMainKeyboard } from "./keyboards";
import { logger } from "../lib/logger";
import type { Lang } from "./userProfile";
import { useCredit, getCredits, getFreeCredits } from "./aiCreditStore";
import { recordEvent } from "./statsStore";
import { LEGAL_SYSTEM_PROMPT } from "../routes/aiChat";

function getAnthropicClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY_NOT_SET");
  return new Anthropic({ apiKey });
}

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
    const answer = block?.type === "text" ? block.text : "Natija olinmadi.";

    await bot.deleteMessage(chatId, processingMsg.message_id).catch(() => {});

    const wasFree = getFreeCredits(userId) > 0;
    useCredit(userId);
    recordEvent(userId, "ai_question", wasFree ? "free" : "paid");
    const remaining = getCredits(userId);

    const creditNote = remaining > 0
      ? `\n\nQolgan kreditlar: ${remaining} ta. Yana savol berish uchun xabar yuboring.`
      : `\n\nKreditlaringiz tugadi. Davom etish uchun /ai buyrug'ini yuboring.`;

    const disclaimer = `\n\nUshbu tahlil AI tomonidan lex.uz normativ bazasi asosida tayyorlangan. Muhim qarorlar uchun malakali yurist bilan maslahatlashing.`;

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
