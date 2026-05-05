import TelegramBot from "node-telegram-bot-api";
import { logger } from "../lib/logger";
import { setupHandlers, warmPdfCache } from "./handlers";

const TOKEN = process.env["TELEGRAM_BOT_TOKEN"];

if (!TOKEN) {
  throw new Error("TELEGRAM_BOT_TOKEN muhit o'zgaruvchisi topilmadi!");
}

let bot: TelegramBot | null = null;

export function startBot(): void {
  if (bot) return;

  bot = new TelegramBot(TOKEN, { polling: true });

  setupHandlers(bot);

  bot.setMyCommands([
    { command: "start", description: "🏠 Bosh menyu" },
    { command: "help",  description: "ℹ️ Yordam va xizmatlar haqida" },
  ]).catch((err) => logger.error({ err }, "setMyCommands xato"));

  bot.on("polling_error", (err) => {
    logger.error({ err }, "Telegram polling error");
  });

  bot.on("error", (err) => {
    logger.error({ err }, "Telegram bot error");
  });

  logger.info("Telegram bot ishga tushdi (polling mode)");

  warmPdfCache().catch((err) => logger.error({ err }, "PDF cache warm qilishda xato"));
}

export function getBot(): TelegramBot | null {
  return bot;
}
