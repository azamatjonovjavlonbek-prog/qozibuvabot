import TelegramBot from "node-telegram-bot-api";
import https from "https";
import http from "http";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ?? "dummy",
});
import { t } from "./i18n";
import type { Lang } from "./userProfile";
import { backToMainKeyboard } from "./keyboards";
import { logger } from "../lib/logger";
import { recordEvent } from "./statsStore";

async function downloadBuffer(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith("https") ? https : http;
    proto.get(url, (res) => {
      const chunks: Buffer[] = [];
      res.on("data", (chunk: Buffer) => chunks.push(chunk));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
    }).on("error", reject);
  });
}

async function extractPdfText(buf: Buffer): Promise<string> {
  const pdfParse = (await import("pdf-parse")).default;
  const data = await pdfParse(buf);
  return data.text.trim();
}

async function extractDocxText(buf: Buffer): Promise<string> {
  const mammoth = (await import("mammoth")).default;
  const result = await mammoth.extractRawText({ buffer: buf });
  return result.value.trim();
}

const SYSTEM_PROMPT = `Siz O'zbekiston qonunchiligiga ixtisoslashgan huquqiy tahlil yordamchisisiz. 
Foydalanuvchi sizga huquqiy hujjat (shartnoma, ariza yoki boshqa hujjat) yuklaydi.

Quyidagi tartibda tahlil qiling:

1. **Hujjat turi va maqsadi** — hujjat nima ekanligini qisqacha aniqlang
2. **Asosiy shartlar va bandlar** — muhim huquqiy bandlarni ajratib ko'rsating
3. **Xavfli yoki muammoli joylar** — foydalanuvchi uchun noqulay yoki xavfli bo'lishi mumkin bo'lgan bandlar
4. **O'zbekiston qonunchiligiga muvofiqligi** — O'zbekiston Fuqarolik kodeksi, Mehnat kodeksi va boshqa tegishli qonunlar asosida baholang (lex.uz ga mos)
5. **Tavsiyalar** — foydalanuvchiga nima qilish kerakligi bo'yicha amaliy maslahat

Javobni o'zbek tilida, aniq va tushunarli tarzda yozing.
Har bir bo'limni sarlavha bilan ajrating.
Juda uzun bo'lmagan, lekin to'liq va foydali javob bering.`;

export async function handleDocumentAnalysis(
  bot: TelegramBot,
  userId: number,
  chatId: number,
  lang: Lang,
  msg: TelegramBot.Message,
): Promise<void> {
  const token = process.env["TELEGRAM_BOT_TOKEN"]!;
  const hasPhoto = msg.photo && msg.photo.length > 0;
  const hasDoc = !!msg.document;

  if (!hasPhoto && !hasDoc) {
    await bot.sendMessage(chatId, t(lang, "tahlil_unsupported"), {
      parse_mode: "Markdown",
      reply_markup: backToMainKeyboard(lang),
    });
    return;
  }

  const processingMsg = await bot.sendMessage(chatId, t(lang, "tahlil_processing"), {
    parse_mode: "Markdown",
  });

  try {
    let analysisResult: string;

    if (hasPhoto) {
      const photo = msg.photo![msg.photo!.length - 1]!;
      const fileInfo = await bot.getFile(photo.file_id);
      const fileUrl = `https://api.telegram.org/file/bot${token}/${fileInfo.file_path}`;
      const imgBuf = await downloadBuffer(fileUrl);
      const base64 = imgBuf.toString("base64");

      const mimeType = "image/jpeg";
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 8192,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: { type: "base64", media_type: mimeType, data: base64 },
              },
              {
                type: "text",
                text: "Ushbu hujjatni O'zbekiston qonunchiligiga asoslanib tahlil qiling.",
              },
            ],
          },
        ],
      });

      const block = response.content[0];
      analysisResult = block.type === "text" ? block.text : "Natija olinmadi.";

    } else {
      const doc = msg.document!;
      const mime = doc.mime_type ?? "";
      const isImage = mime.startsWith("image/");
      const isPdf = mime === "application/pdf";
      const isDocx = mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        || doc.file_name?.toLowerCase().endsWith(".docx");

      if (!isPdf && !isDocx && !isImage) {
        await bot.deleteMessage(chatId, processingMsg.message_id).catch(() => {});
        await bot.sendMessage(chatId, t(lang, "tahlil_unsupported"), {
          parse_mode: "Markdown",
          reply_markup: backToMainKeyboard(lang),
        });
        return;
      }

      const fileInfo = await bot.getFile(doc.file_id);
      const fileUrl = `https://api.telegram.org/file/bot${token}/${fileInfo.file_path}`;
      const buf = await downloadBuffer(fileUrl);

      if (isPdf || isDocx) {
        const text = isPdf ? await extractPdfText(buf) : await extractDocxText(buf);
        const format = isPdf ? "PDF" : "DOCX";
        if (!text || text.length < 20) {
          await bot.deleteMessage(chatId, processingMsg.message_id).catch(() => {});
          await bot.sendMessage(chatId,
            `⚠️ ${format} dan matn o'qib bo'lmadi. Rasm sifatida yuborib ko'ring.`,
            { reply_markup: backToMainKeyboard(lang) }
          );
          return;
        }

        const truncated = text.length > 12000 ? text.slice(0, 12000) + "\n\n[...hujjat qisqartirildi]" : text;

        const response = await anthropic.messages.create({
          model: "claude-sonnet-4-6",
          max_tokens: 8192,
          system: SYSTEM_PROMPT,
          messages: [
            {
              role: "user",
              content: `Quyidagi hujjat matnini O'zbekiston qonunchiligiga asoslanib tahlil qiling:\n\n${truncated}`,
            },
          ],
        });

        const block = response.content[0];
        analysisResult = block.type === "text" ? block.text : "Natija olinmadi.";

      } else {
        const base64 = buf.toString("base64");
        const mt = mime as "image/jpeg" | "image/png" | "image/gif" | "image/webp";

        const response = await anthropic.messages.create({
          model: "claude-sonnet-4-6",
          max_tokens: 8192,
          system: SYSTEM_PROMPT,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "image",
                  source: { type: "base64", media_type: mt, data: base64 },
                },
                {
                  type: "text",
                  text: "Ushbu hujjatni O'zbekiston qonunchiligiga asoslanib tahlil qiling.",
                },
              ],
            },
          ],
        });

        const block = response.content[0];
        analysisResult = block.type === "text" ? block.text : "Natija olinmadi.";
      }
    }

    await bot.deleteMessage(chatId, processingMsg.message_id).catch(() => {});
    recordEvent(userId, "doc_analysis");

    const disclaimer = t(lang, "tahlil_disclaimer");
    const fullMessage = `${analysisResult}\n\n---\n${disclaimer}`;

    if (fullMessage.length > 4000) {
      const chunks = splitMessage(fullMessage, 4000);
      for (let i = 0; i < chunks.length; i++) {
        const isLast = i === chunks.length - 1;
        await bot.sendMessage(chatId, chunks[i]!, {
          parse_mode: "Markdown",
          reply_markup: isLast ? backToMainKeyboard(lang) : undefined,
        });
      }
    } else {
      await bot.sendMessage(chatId, fullMessage, {
        parse_mode: "Markdown",
        reply_markup: backToMainKeyboard(lang),
      });
    }

    logger.info({ userId, lang }, "Hujjat tahlili muvaffaqiyatli yakunlandi");

  } catch (err) {
    logger.error({ err, userId }, "Hujjat tahlilida xato");
    await bot.deleteMessage(chatId, processingMsg.message_id).catch(() => {});
    await bot.sendMessage(chatId, t(lang, "tahlil_error"), {
      parse_mode: "Markdown",
      reply_markup: backToMainKeyboard(lang),
    });
  }
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
