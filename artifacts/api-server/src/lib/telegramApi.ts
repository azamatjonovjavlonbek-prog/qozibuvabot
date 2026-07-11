import { logger } from "./logger";

const tgBase = () =>
  `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN ?? ""}`;

export async function tgSendPhoto(
  chatId: number,
  buffer: Buffer,
  mimetype: string,
  filename: string,
  options: { caption?: string; parse_mode?: string; reply_markup?: object },
): Promise<void> {
  const form = new FormData();
  form.append("chat_id", String(chatId));
  if (options.caption) form.append("caption", options.caption);
  if (options.parse_mode) form.append("parse_mode", options.parse_mode);
  if (options.reply_markup)
    form.append("reply_markup", JSON.stringify(options.reply_markup));
  form.append(
    "photo",
    new Blob([new Uint8Array(buffer)], { type: mimetype }),
    filename,
  );
  const res = await fetch(`${tgBase()}/sendPhoto`, { method: "POST", body: form });
  if (!res.ok) {
    const err = await res.text();
    logger.error({ err, chatId }, "tgSendPhoto xato");
    throw new Error(`tgSendPhoto failed: ${err}`);
  }
}

export async function tgSendDocument(
  chatId: number,
  buffer: Buffer,
  mimetype: string,
  filename: string,
  options: { caption?: string; parse_mode?: string; reply_markup?: object },
): Promise<void> {
  const form = new FormData();
  form.append("chat_id", String(chatId));
  if (options.caption) form.append("caption", options.caption);
  if (options.parse_mode) form.append("parse_mode", options.parse_mode);
  if (options.reply_markup)
    form.append("reply_markup", JSON.stringify(options.reply_markup));
  form.append(
    "document",
    new Blob([new Uint8Array(buffer)], { type: mimetype }),
    filename,
  );
  const res = await fetch(`${tgBase()}/sendDocument`, { method: "POST", body: form });
  if (!res.ok) {
    const err = await res.text();
    logger.error({ err, chatId }, "tgSendDocument xato");
    throw new Error(`tgSendDocument failed: ${err}`);
  }
}

export async function tgSendMessage(
  chatId: number,
  text: string,
  options: { parse_mode?: string; reply_markup?: object },
): Promise<void> {
  const body = {
    chat_id: chatId,
    text,
    ...options,
    reply_markup: options.reply_markup ? JSON.stringify(options.reply_markup) : undefined,
  };
  const res = await fetch(`${tgBase()}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, ...options }),
  });
  if (!res.ok) {
    const err = await res.text();
    logger.error({ err, chatId }, "tgSendMessage xato");
    throw new Error(`tgSendMessage failed: ${err}`);
  }
}
