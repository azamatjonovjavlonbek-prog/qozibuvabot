import TelegramBot from "node-telegram-bot-api";
import { logger } from "../lib/logger";
import { setupHandlers, warmPdfCache } from "./handlers";
import { cleanupOldStates } from "./state";
import { cleanupOldProfiles } from "./userProfile";

const TOKEN = process.env["TELEGRAM_BOT_TOKEN"];

if (!TOKEN) {
  throw new Error("TELEGRAM_BOT_TOKEN muhit o'zgaruvchisi topilmadi!");
}

let bot: TelegramBot | null = null;
let lastUpdateTime = Date.now();
let pollingRestartCount = 0;

export function recordBotActivity(): void {
  lastUpdateTime = Date.now();
}

async function createBot(): Promise<TelegramBot> {
  const tempBot = new TelegramBot(TOKEN!, { polling: false });
  try {
    await tempBot.deleteWebHook();
    logger.info("Webhook o'chirildi, polling boshlanyapti");
  } catch (err) {
    logger.warn({ err }, "Webhook o'chirishda xato (ehtimol yo'q edi)");
  }

  const instance = new TelegramBot(TOKEN!, {
    polling: {
      interval: 1000,
      autoStart: true,
      params: { timeout: 30 },
    },
  });

  instance.on("polling_error", (err: Error & { code?: string }) => {
    logger.error({ code: err.code, msg: err.message }, "Telegram polling error");

    if (err.code === "ETELEGRAM" && err.message.includes("409")) {
      logger.warn("409 Conflict — boshqa bot instance bor, 15s kutilmoqda...");
      setTimeout(() => {
        restartPolling();
      }, 15_000);
    } else {
      setTimeout(() => {
        restartPolling();
      }, 5_000);
    }
  });

  instance.on("error", (err) => {
    logger.error({ err }, "Telegram bot error");
  });

  return instance;
}

async function restartPolling(): Promise<void> {
  if (!bot) return;
  pollingRestartCount++;
  logger.info({ count: pollingRestartCount }, "Polling qayta ishga tushirilmoqda...");
  try {
    await bot.stopPolling();
  } catch { }
  try {
    const tempBot = new TelegramBot(TOKEN!, { polling: false });
    await tempBot.deleteWebHook();
  } catch { }
  try {
    await bot.startPolling();
    lastUpdateTime = Date.now();
    logger.info("Polling qayta ishga tushdi");
  } catch (err) {
    logger.error({ err }, "Polling qayta ishga tushirishda xato, 10s kutilmoqda");
    setTimeout(() => restartPolling(), 10_000);
  }
}

function startWatchdog(): void {
  const WATCHDOG_INTERVAL = 5 * 60 * 1000;
  const MAX_SILENCE = 20 * 60 * 1000;

  setInterval(() => {
    const silence = Date.now() - lastUpdateTime;
    if (silence > MAX_SILENCE) {
      logger.warn({ silenceMs: silence }, "Polling watchdog: uzoq vaqt update yo'q — polling qayta ishga tushirilmoqda");
      restartPolling();
    }

    cleanupOldStates();
    cleanupOldProfiles();
  }, WATCHDOG_INTERVAL);

  logger.info("Polling watchdog ishga tushdi (har 5 daqiqada tekshiradi)");
}

export async function startBot(): Promise<void> {
  if (bot) return;

  bot = await createBot();

  setupHandlers(bot);

  bot.setMyCommands([
    { command: "start", description: "Botni ishga tushirish" },
    { command: "help",  description: "Yordam" },
    { command: "clean", description: "Chatni tozalash" },
  ]).catch((err) => logger.error({ err }, "setMyCommands xato"));

  fetch(`https://api.telegram.org/bot${TOKEN}/setChatMenuButton`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ menu_button: { type: "commands" } }),
  }).catch((err) => logger.error({ err }, "setChatMenuButton xato"));

  lastUpdateTime = Date.now();
  startWatchdog();

  logger.info("Telegram bot ishga tushdi (polling mode)");

  warmPdfCache().catch((err) => logger.error({ err }, "PDF cache warm qilishda xato"));
}

export function getBot(): TelegramBot | null {
  return bot;
}
