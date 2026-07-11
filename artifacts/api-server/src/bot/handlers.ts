import fs from "fs";
import path from "path";
import TelegramBot from "node-telegram-bot-api";
import PDFDocument from "pdfkit";
import {
  ARIZA_CATEGORIES,
  SHABLON_PRICE,
  CONSULTATION_PRICE,
  CONSULTATION_PHONE,
  CONSULTATION_HOURS,
  PROFESSIONAL_PRICE_LABEL,
  CARD_NUMBER,
  CARD_OWNER,
  ADMIN_ID,
  REQUIRED_CHANNEL,
} from "./config";
import { sendTelegramInvoice } from "./paymentFlow";
import { getState, setState, resetState, getAdminState, setAdminState, resetAdminState } from "./state";
import {
  subscriptionKeyboard,
  languageKeyboard,
  phoneKeyboard,
  removeKeyboard,
  mainMenuKeyboard,
  arizaMenuKeyboard,
  shablonListKeyboard,
  confirmShablonKeyboard,
  confirmProfessionalKeyboard,
  confirmConsultationKeyboard,
  cancelKeyboard,
  adminApproveKeyboard,
  backToMainKeyboard,
  aiCreditsKeyboard,
  paymentMethodKeyboard,
} from "./keyboards";
import { handleAiLegalQuestion } from "./aiLegalHandler";
import { getCredits, hasCredits, addPaidCredits, AI_CREDIT_PRICE } from "./aiCreditStore";
import { logger } from "../lib/logger";
import { handleCourts, sendCourtsIntro } from "./courtsHandler";
import { handleAliment, handleAlimentSalaryInput } from "./alimentHandler";
import { handleDocumentAnalysis } from "./documentAnalysisHandler";
import { getTemplate, setTemplate, listTemplates } from "./templateStore";
import { ARIZA_CATEGORIES as CATS } from "./config";
import { getLang, getProfile, setProfile, isRegistered, updatePhone } from "./userProfile";
import type { Lang } from "./userProfile";
import {
  t, tMainMenu, tMenuHeader, tShablonList, tShablonConfirm, tPayShablon,
  tProfessional, tPayProfessional, tConsultation, tPayConsultation,
  tApprovedShablon, tApprovedConsultation, tCatLabel, tHelp,
  tProPrice, tHours, tSom,
} from "./i18n";
import { addUser, getUserCount, getTodayCount, getWeekCount, getMonthCount, getAllUserIds } from "./userCounter";
import { recordBotActivity } from "./index";
import { touchProfile } from "./userProfile";
import { recordEvent, getStats, getStatsByPeriod, getActiveUsersCount, getUniqueJoinUsers } from "./statsStore";
import { db, professionalRequestsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const FONT_PATH = path.join(process.cwd(), "assets", "NotoSans-Regular.ttf");
let FONT_BUFFER: Buffer;
try {
  FONT_BUFFER = fs.readFileSync(FONT_PATH);
} catch (err) {
  // Font topilmasa — Helvetica bilan ishlayveradi
  FONT_BUFFER = Buffer.alloc(0);
}


function generatePdfBuffer(content: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 60, size: "A4" });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
    if (FONT_BUFFER.length > 0) {
      doc.registerFont("NotoSans", FONT_BUFFER);
      doc.fontSize(11).font("NotoSans").text(content, { lineGap: 4 });
    } else {
      doc.fontSize(11).font("Helvetica").text(content, { lineGap: 4 });
    }
    doc.end();
  });
}

const pdfCache = new Map<string, Buffer>();

async function safeEdit(
  bot: TelegramBot,
  chatId: number,
  messageId: number,
  text: string,
  options?: TelegramBot.EditMessageTextOptions,
): Promise<void> {
  try {
    await bot.editMessageText(text, {
      chat_id: chatId,
      message_id: messageId,
      ...options,
    });
  } catch {
    await bot.sendMessage(chatId, text, {
      parse_mode: options?.parse_mode,
      reply_markup: options?.reply_markup as TelegramBot.ReplyKeyboardMarkup,
    });
  }
}

async function isSubscribed(bot: TelegramBot, userId: number): Promise<boolean> {
  try {
    const member = await bot.getChatMember(REQUIRED_CHANNEL, userId);
    return ["member", "administrator", "creator"].includes(member.status);
  } catch {
    return false;
  }
}

async function sendSubscriptionPrompt(bot: TelegramBot, chatId: number): Promise<void> {
  await bot.sendMessage(chatId,
    `⚠️ *Botdan foydalanish uchun kanalga obuna bo'lishingiz shart!*\n\n` +
    `📢 Quyidagi kanalga obuna bo'ling va "✅ Obuna bo'ldim" tugmasini bosing:\n\n` +
    `👇 *@yurist_azamatjonov*`,
    { parse_mode: "Markdown", reply_markup: subscriptionKeyboard() }
  );
}

export function setupHandlers(bot: TelegramBot): void {

  // ── /start ────────────────────────────────────────────────────────────────
  bot.onText(/\/start/, async (msg) => {
    recordBotActivity();
    const chatId = msg.chat.id;
    const userId = msg.from?.id ?? chatId;
    try {
      if (userId === ADMIN_ID) {
        resetState(userId);
        const total = getUserCount();
        const today = getTodayCount();
        await bot.sendMessage(chatId,
          `👋 Assalomu alaykum, Admin!\n\n` +
          `📊 Foydalanuvchilar: *${total}* ta (bugun +${today})\n\n` +
          `📌 Admin komandalari:\n` +
          `/stat — batafsil statistika\n` +
          `/xabar — barcha foydalanuvchilarga xabar yuborish\n` +
          `/yuborish <ID> — foydalanuvchiga fayl yuborish\n` +
          `/settemplate <catId> — shablon o'rnatish\n` +
          `/listtemplates — shablonlar ro'yxati\n` +
          `/bekor — amalni bekor qilish`,
          { parse_mode: "Markdown", reply_markup: mainMenuKeyboard("latin") });
        return;
      }

      // ── Kanal obunasini tekshirish ─────────────────────────────────────
      const subscribed = await isSubscribed(bot, userId);
      if (!subscribed) {
        await sendSubscriptionPrompt(bot, chatId);
        return;
      }

      resetState(userId);
      setState(userId, { step: "selecting_language" });
      await bot.sendMessage(chatId,
        `👋 Assalomu alaykum! / Ассалому алайкум!\n\n🌐 Iltimos, tilni tanlang / Илтимос, тилни танланг:`,
        { reply_markup: languageKeyboard() });
    } catch (err) {
      logger.error({ err, userId }, "/start handleda xato");
    }
  });

  // ── /help ────────────────────────────────────────────────────────────────
  bot.onText(/\/help/, async (msg) => {
    recordBotActivity();
    const chatId = msg.chat.id;
    const userId = msg.from?.id ?? chatId;
    try {
      const lang = getLang(userId);
      await bot.sendMessage(chatId,
        tHelp(lang,
          `${SHABLON_PRICE.toLocaleString()} ${tSom(lang)}`,
          tProPrice(lang),
          `${CONSULTATION_PRICE.toLocaleString()} ${tSom(lang)}`),
        { parse_mode: "Markdown", reply_markup: isRegistered(userId) ? mainMenuKeyboard(lang) : undefined });
    } catch (err) {
      logger.error({ err, userId }, "/help handleda xato");
    }
  });

  // ── /clean ───────────────────────────────────────────────────────────────
  bot.onText(/\/clean/, async (msg) => {
    recordBotActivity();
    const chatId = msg.chat.id;
    const userId = msg.from?.id ?? chatId;
    try {
      const lang = getLang(userId);
      resetState(userId);
      await bot.sendMessage(chatId, t(lang, "main_menu"), {
        parse_mode: "Markdown",
        reply_markup: isRegistered(userId) ? mainMenuKeyboard(lang) : undefined,
      });
    } catch (err) {
      logger.error({ err, userId }, "/clean handleda xato");
    }
  });

  // ── Admin: /yuborish <userId> ─────────────────────────────────────────────
  bot.onText(/\/yuborish(?:\s+(\d+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const adminId = msg.from?.id ?? chatId;
    if (adminId !== ADMIN_ID) return;
    try {
      const rawId = match?.[1];
      if (!rawId) {
        await bot.sendMessage(chatId, `⚠️ Foydalanuvchi ID kiriting: /yuborish 123456789`);
        return;
      }
      const targetUserId = parseInt(rawId);
      if (isNaN(targetUserId)) {
        await bot.sendMessage(chatId, `⚠️ Noto'g'ri ID: ${rawId}`);
        return;
      }
      setAdminState(ADMIN_ID, { step: "sending_ariza", targetUserId });
      await bot.sendMessage(chatId,
        `✅ ID *${targetUserId}* uchun ariza kutilmoqda.\n\nAriza faylini yuboring (hujjat, rasm yoki matn).\n\nBekor qilish: /bekor`,
        { parse_mode: "Markdown" });
    } catch (err) {
      logger.error({ err }, "/yuborish handleda xato");
    }
  });

  // ── Admin: /settemplate <catId> ───────────────────────────────────────────
  bot.onText(/\/settemplate(?:\s+(\w+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    if ((msg.from?.id ?? chatId) !== ADMIN_ID) return;
    try {
      const catId = match?.[1];
      if (!catId) {
        const list = CATS.map((c) => `• \`/settemplate ${c.id}\` — ${c.label}`).join("\n");
        await bot.sendMessage(chatId,
          `📋 *Mavjud kategoriyalar:*\n\n${list}\n\nBirini tanlang va fayl yuboring.`,
          { parse_mode: "Markdown" });
        return;
      }
      const cat = CATS.find((c) => c.id === catId);
      if (!cat) {
        await bot.sendMessage(chatId, `⚠️ Kategoriya topilmadi: \`${catId}\``, { parse_mode: "Markdown" });
        return;
      }
      setAdminState(ADMIN_ID, { step: "setting_template", targetCatId: catId });
      await bot.sendMessage(chatId,
        `📎 *${cat.label}* uchun yangi shablon faylini yuboring.\n\nBekor qilish: /bekor`,
        { parse_mode: "Markdown" });
    } catch (err) {
      logger.error({ err }, "/settemplate handleda xato");
    }
  });

  // ── Admin: /listtemplates ─────────────────────────────────────────────────
  bot.onText(/\/listtemplates/, async (msg) => {
    const chatId = msg.chat.id;
    if ((msg.from?.id ?? chatId) !== ADMIN_ID) return;
    try {
      const templates = listTemplates();
      const templateEntries = Object.entries(templates);
      if (templateEntries.length === 0) {
        await bot.sendMessage(chatId, `📋 Hozircha hech qanday shablon saqlanmagan.`);
        return;
      }
      const list = templateEntries.map(([catId, f]) => `• *${catId}*: ${f.fileName}`).join("\n");
      await bot.sendMessage(chatId, `📋 *Saqlangan shablonlar:*\n\n${list}`, { parse_mode: "Markdown" });
    } catch (err) {
      logger.error({ err }, "/listtemplates handleda xato");
    }
  });

  // ── Admin: /stat ──────────────────────────────────────────────────────────
  bot.onText(/\/stat/, async (msg) => {
    const chatId = msg.chat.id;
    if ((msg.from?.id ?? chatId) !== ADMIN_ID) return;
    try {
      const total   = getUserCount();
      const today   = getTodayCount();
      const week    = getWeekCount();
      const month   = getMonthCount();
      const all     = getStats();
      const todayE  = getStatsByPeriod(1);
      const weekE   = getStatsByPeriod(7);
      const monthE  = getStatsByPeriod(30);
      const active7 = getActiveUsersCount(7);
      const active30 = getActiveUsersCount(30);
      const now     = new Date().toLocaleString("uz-UZ", { timeZone: "Asia/Tashkent" });

      const f = (n: number) => n.toLocaleString("uz-UZ");

      const buildSection = (label: string, allKey: string, todayKey: string, weekKey: string, monthKey: string) => {
        const a = all[allKey] ?? 0;
        if (a === 0) return "";
        const t = todayE[todayKey] ?? 0;
        const w = weekE[weekKey] ?? 0;
        const m = monthE[monthKey] ?? 0;
        return `  \u2022 ${label}: ${f(a)} (bugun +${f(t)}, 7kun +${f(w)}, 30kun +${f(m)})\n`;
      };

      let usage = "";
      usage += buildSection("📝 Shablon arizalar",     "shablon_approved",     "shablon_order",     "shablon_order",     "shablon_order");
      usage += buildSection("✍️ Professional arizalar", "professional_approved", "professional_order", "professional_order", "professional_order");
      usage += buildSection("📞 Konsultatsiyalar",      "consultation_approved", "consultation_order", "consultation_order", "consultation_order");
      usage += buildSection("🤖 AI savollar",            "ai_question",          "ai_question",        "ai_question",        "ai_question");
      usage += buildSection("💳 AI kredit sotib olish", "ai_credit_purchased",  "ai_credit_purchased", "ai_credit_purchased", "ai_credit_purchased");
      usage += buildSection("👨\u200d🦰 Aliment hisoblash",  "aliment_calc",         "aliment_calc",       "aliment_calc",       "aliment_calc");
      usage += buildSection("🏛 Sudlar ma'lumotlari",    "courts_detail",        "courts_view",        "courts_view",        "courts_view");
      usage += buildSection("📄 Hujjat tahlili",        "doc_analysis",         "doc_analysis",       "doc_analysis",       "doc_analysis");

      await bot.sendMessage(chatId,
        `📊 *Bot statistikasi*\n\n` +
        `👥 Jami foydalanuvchilar: *${f(total)}*\n` +
        `📅 Bugun yangi: *${f(today)}*\n` +
        `📆 Oxirgi 7 kun: *${f(week)}*\n` +
        `🗓 Oxirgi 30 kun: *${f(month)}*\n\n` +
        `🔥 Faol foydalanuvchilar:\n` +
        `  \u2022 Oxirgi 7 kun: *${f(active7)}*\n` +
        `  \u2022 Oxirgi 30 kun: *${f(active30)}*\n\n` +
        (usage ? `📈 Xizmatlar bo'yicha:\n${usage}\n` : "") +
        `🕐 _${now}_`,
        { parse_mode: "Markdown" });
    } catch (err) {
      logger.error({ err }, "/stat handleda xato");
    }
  });

  // ── Admin: /bekor ─────────────────────────────────────────────────────────
  bot.onText(/\/bekor/, async (msg) => {
    const chatId = msg.chat.id;
    const adminId = msg.from?.id ?? chatId;
    if (adminId !== ADMIN_ID) return;
    try {
      resetAdminState(ADMIN_ID);
      await bot.sendMessage(chatId, `✅ Amal bekor qilindi.`);
    } catch (err) {
      logger.error({ err }, "/bekor handleda xato");
    }
  });

  // ── Admin: /xabar — barcha foydalanuvchilarga broadcast ──────────────────
  bot.onText(/\/xabar/, async (msg) => {
    const chatId = msg.chat.id;
    const adminId = msg.from?.id ?? chatId;
    if (adminId !== ADMIN_ID) return;
    try {
      const total = getUserCount();
      setAdminState(ADMIN_ID, { step: "broadcasting" });
      await bot.sendMessage(chatId,
        `📢 *Broadcast xabari*\n\n` +
        `Jami *${total}* ta foydalanuvchiga yuboriladigan xabarni yozing.\n\n` +
        `_Matn, rasm, video yoki hujjat yuborishingiz mumkin._\n\n` +
        `Bekor qilish: /bekor`,
        { parse_mode: "Markdown" }
      );
    } catch (err) {
      logger.error({ err }, "/xabar handleda xato");
    }
  });

  // ── Callback query handler ────────────────────────────────────────────────
  bot.on("callback_query", async (query) => {
    recordBotActivity();
    const chatId = query.message?.chat.id;
    const messageId = query.message?.message_id;
    const userId = query.from.id;
    const data = query.data ?? "";
    const username = query.from.username
      ? `@${query.from.username}`
      : (query.from.first_name ?? "Noma'lum");

    if (!chatId || !messageId) return;

    touchProfile(userId);
    const lang = getLang(userId);

    try {
      await bot.answerCallbackQuery(query.id);
    } catch { /* ignore stale callback */ }

    try {
      // ── Sudlar manzillari ──────────────────────────────────────────────
      if (
        data === "courts" ||
        data.startsWith("ct:") ||
        data.startsWith("cr:") ||
        data.startsWith("cd:")
      ) {
        const handled = await handleCourts(bot, query, data, chatId, messageId);
        if (handled) return;
      }

      // ── Aliment kalkulyatori ───────────────────────────────────────────
      if (
        data === "menu_aliment" ||
        data === "aliment_calculate" ||
        data === "aliment_back_to_salary" ||
        data === "aliment_back_to_children" ||
        data.startsWith("aliment_status:") ||
        data.startsWith("aliment_children:")
      ) {
        await handleAliment(bot, userId, chatId, messageId, data);
        return;
      }

      // ── Kanal obunasini tekshirish ─────────────────────────────────────
      if (data === "check_sub") {
        const subscribed = await isSubscribed(bot, userId);
        if (!subscribed) {
          await bot.answerCallbackQuery(query.id, {
            text: "❌ Siz hali kanalga obuna bo'lmagansiz!",
            show_alert: true,
          });
          return;
        }
        await bot.answerCallbackQuery(query.id, { text: "✅ Rahmat! Obuna tasdiqlandi." });
        try {
          await bot.deleteMessage(chatId, messageId);
        } catch { /* ignore */ }
        resetState(userId);
        if (!isRegistered(userId)) {
          setState(userId, { step: "selecting_language" });
          await bot.sendMessage(chatId,
            `👋 Assalomu alaykum! / Ассалому алайкум!\n\n🌐 Iltimos, tilni tanlang / Илтимос, тилни танланг:`,
            { reply_markup: languageKeyboard() });
        } else {
          const userLang = getLang(userId);
          await bot.sendMessage(chatId, t(userLang, "main_menu"), {
            parse_mode: "Markdown",
            reply_markup: mainMenuKeyboard(userLang),
          });
        }
        return;
      }

      // ── Til tanlash ────────────────────────────────────────────────────
      if (data === "lang_latin" || data === "lang_cyrillic") {
        const selectedLang: Lang = data === "lang_latin" ? "latin" : "cyrillic";
        setProfile(userId, { lang: selectedLang });
        addUser(userId);
        recordEvent(userId, "join");
        resetState(userId);
        await bot.sendMessage(chatId, t(selectedLang, "main_menu"), {
          parse_mode: "Markdown",
          reply_markup: mainMenuKeyboard(selectedLang),
        });
        return;
      }

      // ── Bosh menyu ────────────────────────────────────────────────────
      if (data === "back_main") {
        resetState(userId);
        await bot.sendMessage(chatId, t(lang, "main_menu"), {
          parse_mode: "Markdown",
          reply_markup: mainMenuKeyboard(lang),
        });
        return;
      }

      // ── Chatni tozalash ───────────────────────────────────────────────
      if (data === "chat_clear") {
        resetState(userId);
        try { await bot.deleteMessage(chatId, messageId); } catch { /* ignore */ }
        await bot.sendMessage(
          chatId,
          t(lang, "main_menu"),
          { parse_mode: "Markdown", reply_markup: mainMenuKeyboard(lang) }
        );
        return;
      }

      // ── Biz haqimizda ─────────────────────────────────────────────────
      if (data === "menu_about") {
        await safeEdit(
          bot, chatId, messageId,
          tMainMenu(
            lang,
            `${SHABLON_PRICE.toLocaleString()} ${tSom(lang)}`,
            tProPrice(lang),
            `${CONSULTATION_PRICE.toLocaleString()} ${tSom(lang)}`,
            CARD_NUMBER,
            CARD_OWNER,
            tHours(lang),
          ),
          { parse_mode: "Markdown", reply_markup: backToMainKeyboard(lang) }
        );
        return;
      }

      // ── Qozibuva AI kredit to'lovi ────────────────────────────────────
      if (data === "pay_ai_credits") {
        setState(userId, { step: "ai_legal_pay_check" });
        const price = AI_CREDIT_PRICE.toLocaleString();
        await safeEdit(
          bot, chatId, messageId,
          lang === "cyrillic"
            ? `💳 *Тўлов маълумотлари*\n\nХизмат: *Qozibuva AI — 5 та савол*\nСумма: *${price} сўм*\n\nКарта рақами:\n\`${CARD_NUMBER}\`\nКарта эгаси: *${CARD_OWNER}*\n\nТўлов қилгандан сўнг *тўлов чеки (screenshot)* расмини шу чатга юборинг.`
            : `💳 *To'lov ma'lumotlari*\n\nXizmat: *Qozibuva AI — 5 ta savol*\nSumma: *${price} so'm*\n\nKarta raqami:\n\`${CARD_NUMBER}\`\nKarta egasi: *${CARD_OWNER}*\n\nTo'lov qilgandan so'ng *to'lov cheki (screenshot)* rasmini shu chatga yuboring.`,
          { parse_mode: "Markdown", reply_markup: cancelKeyboard(lang) }
        );
        return;
      }

      // ── Ariza bo'limi ─────────────────────────────────────────────────
      if (data === "menu_ariza") {
        setState(userId, { step: "idle" });
        await safeEdit(
          bot, chatId, messageId,
          t(lang, "ariza_menu"),
          { parse_mode: "Markdown", reply_markup: arizaMenuKeyboard(lang) }
        );
        return;
      }

      // ── Shablon ariza ro'yxati ─────────────────────────────────────────
      if (data === "menu_shablon") {
        setState(userId, { step: "selecting_shablon" });
        await safeEdit(
          bot, chatId, messageId,
          tShablonList(lang, `${SHABLON_PRICE.toLocaleString()} ${lang === "cyrillic" ? "сўм" : "so'm"}`),
          { parse_mode: "Markdown", reply_markup: shablonListKeyboard(lang) }
        );
        return;
      }

      if (data.startsWith("shablon_")) {
        const catId = data.replace("shablon_", "");
        const cat = ARIZA_CATEGORIES.find((c) => c.id === catId);
        if (!cat) return;

        setState(userId, { step: "confirming_shablon", selectedServiceId: catId });
        await safeEdit(
          bot, chatId, messageId,
          tShablonConfirm(
            lang,
            tCatLabel(lang, cat.label),
            `${SHABLON_PRICE.toLocaleString()} ${lang === "cyrillic" ? "сўм" : "so'm"}`,
          ),
          { parse_mode: "Markdown", reply_markup: confirmShablonKeyboard(catId, lang) }
        );
        return;
      }

      if (data.startsWith("pay_shablon_")) {
        const catId = data.replace("pay_shablon_", "");
        const cat = ARIZA_CATEGORIES.find((c) => c.id === catId);
        if (!cat) return;

        recordEvent(userId, "shablon_order", catId);
        setState(userId, {
          step: "waiting_shablon_check",
          selectedServiceId: catId,
          pendingChatId: chatId,
          pendingUsername: username,
          pendingType: "shablon",
        });
        await safeEdit(
          bot, chatId, messageId,
          tPayShablon(
            lang,
            tCatLabel(lang, cat.label),
            `${SHABLON_PRICE.toLocaleString()} ${lang === "cyrillic" ? "сўм" : "so'm"}`,
            CARD_NUMBER,
            CARD_OWNER,
          ),
          { parse_mode: "Markdown", reply_markup: cancelKeyboard(lang) }
        );
        return;
      }

      // ── Professional ariza ─────────────────────────────────────────────
      if (data === "menu_professional") {
        setState(userId, { step: "confirming_professional", selectedServiceId: "general" });
        await safeEdit(
          bot, chatId, messageId,
          tProfessional(lang, tProPrice(lang)),
          { parse_mode: "Markdown", reply_markup: confirmProfessionalKeyboard(lang) }
        );
        return;
      }

      if (data === "pay_pro_general") {
        recordEvent(userId, "professional_order");
        setState(userId, {
          step: "waiting_professional_check",
          selectedServiceId: "general",
          pendingChatId: chatId,
          pendingUsername: username,
          pendingType: "professional",
        });
        await safeEdit(
          bot, chatId, messageId,
          tPayProfessional(lang, tProPrice(lang), CARD_NUMBER, CARD_OWNER),
          { parse_mode: "Markdown", reply_markup: cancelKeyboard(lang) }
        );
        return;
      }

      // ── Konsultatsiya ──────────────────────────────────────────────────
      if (data === "menu_consultation") {
        setState(userId, { step: "selecting_consultation" });
        await safeEdit(
          bot, chatId, messageId,
          tConsultation(
            lang,
            `${CONSULTATION_PRICE.toLocaleString()} ${tSom(lang)}`,
            tHours(lang),
          ),
          { parse_mode: "Markdown", reply_markup: confirmConsultationKeyboard(lang) }
        );
        return;
      }

      if (data === "pay_consultation") {
        recordEvent(userId, "consultation_order");
        setState(userId, {
          step: "waiting_consultation_check",
          pendingChatId: chatId,
          pendingUsername: username,
          pendingType: "consultation",
        });
        await safeEdit(
          bot, chatId, messageId,
          tPayConsultation(
            lang,
            `${CONSULTATION_PRICE.toLocaleString()} ${lang === "cyrillic" ? "сўм" : "so'm"}`,
            CARD_NUMBER,
            CARD_OWNER,
          ),
          { parse_mode: "Markdown", reply_markup: cancelKeyboard(lang) }
        );
        return;
      }

      // ── Admin: shablon tasdiqlash  admin_ok_s:<userId>:<catId> ────────
      if (data.startsWith("admin_ok_s:")) {
        const parts = data.split(":");
        const targetUserId = parseInt(parts[1]!);
        const catId = parts[2]!;
        const cat = ARIZA_CATEGORIES.find((c) => c.id === catId);

        if (!cat) {
          await bot.sendMessage(chatId, `⚠️ Kategoriya topilmadi: ${catId}`);
          return;
        }

        await bot.sendMessage(chatId, `✅ Tasdiqlandi! Shablon ariza yuborilmoqda.`);
        recordEvent(targetUserId, "shablon_approved", catId);
        const userLang = getLang(targetUserId);
        await bot.sendMessage(targetUserId,
          tApprovedShablon(userLang, tCatLabel(userLang, cat.label)),
          { parse_mode: "Markdown" }
        );
        await sendShablonDocument(bot, targetUserId, catId, userLang);
        resetState(targetUserId);
        return;
      }

      // ── Admin: professional tasdiqlash  admin_ok_p:<userId> ───────────
      if (data.startsWith("admin_ok_p:")) {
        const targetUserId = parseInt(data.split(":")[1]!);
        const userLang = getLang(targetUserId);
        await bot.sendMessage(chatId, `✅ Tasdiqlandi! Foydalanuvchiga xabar yuborildi.`);
        recordEvent(targetUserId, "professional_approved");
        const phoneMsg = userLang === "cyrillic"
          ? `✅ *Тўловингиз тасдиқланди!*\n\nПрофессионал ариза буюртмангиз қабул қилинди.\n\n📞 Юристимиз телефон рақами:\n*${CONSULTATION_PHONE}*\n\nИш вақти: *${CONSULTATION_HOURS}*\nЗанг қилинг — юрист сиз билан аризани муҳокама қилади ва тайёр аризани Telegram орқали юборади.`
          : `✅ *To'lovingiz tasdiqlandi!*\n\nProfessional ariza buyurtmangiz qabul qilindi.\n\n📞 Yuristimiz telefon raqami:\n*${CONSULTATION_PHONE}*\n\nIsh vaqti: *${CONSULTATION_HOURS}*\nQo'ng'iroq qiling — yurist siz bilan arizani muhokama qiladi va tayyor arizani Telegram orqali yuboradi.`;
        await bot.sendMessage(targetUserId, phoneMsg,
          { parse_mode: "Markdown", reply_markup: backToMainKeyboard(userLang) }
        );
        try {
          const [latest] = await db.select({ id: professionalRequestsTable.id })
            .from(professionalRequestsTable)
            .where(eq(professionalRequestsTable.userId, targetUserId))
            .orderBy(desc(professionalRequestsTable.createdAt))
            .limit(1);
          if (latest) {
            await db.update(professionalRequestsTable)
              .set({ status: "completed", updatedAt: new Date() })
              .where(eq(professionalRequestsTable.id, latest.id));
          }
        } catch (dbErr) {
          logger.error({ dbErr, targetUserId }, "admin_ok_p DB update xato");
        }
        resetState(targetUserId);
        return;
      }

      // ── Admin: konsultatsiya tasdiqlash  admin_ok_c:<userId> ──────────
      if (data.startsWith("admin_ok_c:")) {
        const targetUserId = parseInt(data.split(":")[1]!);
        const userLang = getLang(targetUserId);
        await bot.sendMessage(chatId, `✅ Tasdiqlandi! Telefon raqam yuborildi.`);
        recordEvent(targetUserId, "consultation_approved");
        await bot.sendMessage(targetUserId,
          tApprovedConsultation(userLang, CONSULTATION_PHONE, tHours(userLang)),
          { parse_mode: "Markdown", reply_markup: backToMainKeyboard(userLang) }
        );
        resetState(targetUserId);
        return;
      }

      // ── Admin: Qozibuva AI kredit tasdiqlash  admin_ok_ai:<userId> ────
      if (data.startsWith("admin_ok_ai:")) {
        const targetUserId = parseInt(data.split(":")[1]!);
        const userLang = getLang(targetUserId);
        addPaidCredits(targetUserId);
        const newTotal = getCredits(targetUserId);
        await bot.sendMessage(chatId, `✅ Tasdiqlandi! Foydalanuvchiga 5 ta kredit qo'shildi.`);
        recordEvent(targetUserId, "ai_credit_purchased");
        await bot.sendMessage(targetUserId,
          userLang === "cyrillic"
            ? `✅ *Тўловингиз тасдиқланди!*\n\n*5 та янги савол кредити* ҳисобингизга қўшилди.\nЖами кредит: *${newTotal} та*\n\n"Qozibuva AI ⚖️" тугмасини босиб давом этинг.`
            : `✅ *To'lovingiz tasdiqlandi!*\n\n*5 ta yangi savol krediti* hisobingizga qo'shildi.\nJami kredit: *${newTotal} ta*\n\n"Qozibuva AI ⚖️" tugmasini bosib davom eting.`,
          { parse_mode: "Markdown", reply_markup: backToMainKeyboard(userLang) }
        );
        resetState(targetUserId);
        return;
      }

      // ── Admin: rad etish  admin_no:<userId> ───────────────────────────
      if (data.startsWith("admin_no:")) {
        const targetUserId = parseInt(data.split(":")[1]!);
        const userLang = getLang(targetUserId);
        await bot.sendMessage(chatId, `❌ Rad etildi. Foydalanuvchiga xabar yuborildi.`);
        await bot.sendMessage(targetUserId,
          t(userLang, "payment_rejected"),
          { parse_mode: "Markdown", reply_markup: backToMainKeyboard(userLang) }
        );
        resetState(targetUserId);
        return;
      }

      // ── Admin: Mini app chek tasdiqlash  admin_ok_mc:<userId> ─────────
      if (data.startsWith("admin_ok_mc:")) {
        const targetUserId = parseInt(data.split(":")[1]!);
        const userLang = getLang(targetUserId);
        await bot.answerCallbackQuery(query.id, { text: "✅ Tasdiqlandi!" });
        await bot.editMessageReplyMarkup({ inline_keyboard: [] }, { chat_id: chatId, message_id: messageId }).catch(() => {});
        await bot.sendMessage(chatId, `✅ *Mini app chek tasdiqlandi!* Foydalanuvchiga telefon raqam yuborildi.`, { parse_mode: "Markdown" });
        recordEvent(targetUserId, "consultation_approved");
        await bot.sendMessage(
          targetUserId,
          tApprovedConsultation(userLang, CONSULTATION_PHONE, tHours(userLang)),
          { parse_mode: "Markdown", reply_markup: backToMainKeyboard(userLang) }
        );
        return;
      }

      // ── Admin: Mini app chek rad etish  admin_no_mc:<userId> ──────────
      if (data.startsWith("admin_no_mc:")) {
        const targetUserId = parseInt(data.split(":")[1]!);
        const userLang = getLang(targetUserId);
        await bot.answerCallbackQuery(query.id, { text: "❌ Rad etildi." });
        await bot.editMessageReplyMarkup({ inline_keyboard: [] }, { chat_id: chatId, message_id: messageId }).catch(() => {});
        await bot.sendMessage(chatId, `❌ *Mini app chek rad etildi.* Foydalanuvchiga xabar yuborildi.`, { parse_mode: "Markdown" });
        await bot.sendMessage(
          targetUserId,
          t(userLang, "payment_rejected"),
          { parse_mode: "Markdown", reply_markup: backToMainKeyboard(userLang) }
        );
        return;
      }

      // ── Admin: professional ariza narxini belgilash  prof_price:<reqId>:<amount> ──
      if (data.startsWith("prof_price:")) {
        const parts = data.split(":");
        const reqId  = parseInt(parts[1]!);
        const amount = parseInt(parts[2]!);
        try {
          const [req] = await db.select()
            .from(professionalRequestsTable)
            .where(eq(professionalRequestsTable.id, reqId))
            .limit(1);
          if (!req) {
            await bot.answerCallbackQuery(query.id, { text: "❌ Ariza topilmadi." });
            return;
          }
          const targetUserId = Number(req.userId);
          await db.update(professionalRequestsTable)
            .set({ status: "priced", price: amount, updatedAt: new Date() })
            .where(eq(professionalRequestsTable.id, reqId));
          setState(targetUserId, { step: "waiting_professional_check", pendingType: "professional", selectedServiceId: "general" });
          const formatted = amount.toLocaleString("uz-UZ");
          const userLang = getLang(targetUserId);
          const payMsg = userLang === "cyrillic"
            ? `💰 *Аризангиз кўриб чиқилди!*\n\nПрофессионал ариза нархи белгиланди: *${formatted} сўм*\n\nТўлов учун карта рақами:\n\`${CARD_NUMBER}\`\nКарта эгаси: *${CARD_OWNER}*\n\nТўловни амалга ошириб, чек (screenshot) расмини *шу чатга* юборинг. Юрист сиз билан тез орада боғланади.`
            : `💰 *Arizangiz ko'rib chiqildi!*\n\nProfessional ariza narxi belgilandi: *${formatted} so'm*\n\nTo'lov uchun karta raqami:\n\`${CARD_NUMBER}\`\nKarta egasi: *${CARD_OWNER}*\n\nTo'lovni amalga oshirib, chek (screenshot) rasmini *shu chatga* yuboring. Yurist siz bilan tez orada bog'lanadi.`;
          await bot.sendMessage(targetUserId, payMsg, { parse_mode: "Markdown" });
          await bot.answerCallbackQuery(query.id, { text: `✅ Narx: ${formatted} so'm` });
          await bot.editMessageReplyMarkup({ inline_keyboard: [] }, { chat_id: chatId, message_id: messageId }).catch(() => {});
          await bot.sendMessage(chatId, `✅ *Narx belgilandi: ${formatted} so'm*\nFoydalanuvchiga to'lov ko'rsatmasi yuborildi.`, { parse_mode: "Markdown" });
        } catch (dbErr) {
          logger.error({ dbErr, reqId }, "prof_price DB xato");
          await bot.answerCallbackQuery(query.id, { text: "❌ Xato yuz berdi." });
        }
        return;
      }

      // ── Admin: professional ariza rad etish  prof_no_req:<reqId> ─────────
      if (data.startsWith("prof_no_req:")) {
        const reqId = parseInt(data.split(":")[1]!);
        try {
          const [req] = await db.select()
            .from(professionalRequestsTable)
            .where(eq(professionalRequestsTable.id, reqId))
            .limit(1);
          if (!req) {
            await bot.answerCallbackQuery(query.id, { text: "❌ Ariza topilmadi." });
            return;
          }
          const targetUserId = Number(req.userId);
          await db.update(professionalRequestsTable)
            .set({ status: "rejected", updatedAt: new Date() })
            .where(eq(professionalRequestsTable.id, reqId));
          const userLang = getLang(targetUserId);
          await bot.sendMessage(targetUserId,
            userLang === "cyrillic"
              ? `❌ *Аризангиз рад этилди.*\n\nАфсуски, ҳозирча сизнинг аризангизни қабул қила олмаймиз. Бошқа савол ёки хизмат учун бош менюга қайтинг.`
              : `❌ *Arizangiz rad etildi.*\n\nAfsuski, hozircha sizning arizangizni qabul qila olmaymiz. Boshqa savol yoki xizmat uchun bosh menyuga qaytng.`,
            { parse_mode: "Markdown", reply_markup: backToMainKeyboard(userLang) }
          );
          await bot.answerCallbackQuery(query.id, { text: "❌ Ariza rad etildi." });
          await bot.editMessageReplyMarkup({ inline_keyboard: [] }, { chat_id: chatId, message_id: messageId }).catch(() => {});
          await bot.sendMessage(chatId, `❌ *Ariza rad etildi.* Foydalanuvchiga xabar yuborildi.`, { parse_mode: "Markdown" });
        } catch (dbErr) {
          logger.error({ dbErr, reqId }, "prof_no_req DB xato");
          await bot.answerCallbackQuery(query.id, { text: "❌ Xato yuz berdi." });
        }
        return;
      }

    } catch (err) {
      logger.error({ err, data, userId }, "Callback query handleda xato");
    }
  });

  // ── Message handler ───────────────────────────────────────────────────────
  bot.on("message", async (msg) => {
    recordBotActivity();
    const chatId = msg.chat.id;
    const userId = msg.from?.id ?? chatId;
    const username = msg.from?.username
      ? `@${msg.from.username}`
      : (msg.from?.first_name ?? "Noma'lum");

    // ── Mini App web_app_data ──────────────────────────────────────────────
    if (msg.web_app_data?.data) {
      touchProfile(userId);
      const lang = getLang(userId);
      try {
        const payload = JSON.parse(msg.web_app_data.data) as {
          type: "shablon" | "consultation" | "ai_credits" | "ai_chat" | "tahlil_request" | "professional_ariza";
          catId?: string;
          label?: string;
        };

        if (payload.type === "shablon") {
          const label = payload.label ?? "Ariza";
          const priceStr = `${SHABLON_PRICE.toLocaleString()} ${lang === "cyrillic" ? "сўм" : "so'm"}`;
          setState(userId, {
            step: "waiting_shablon_check",
            selectedServiceId: payload.catId ?? "other",
            pendingChatId: chatId,
            pendingUsername: username,
            pendingType: "shablon",
          });
          recordEvent(userId, "mini_app_shablon_order");
          await bot.sendMessage(
            chatId,
            tPayShablon(lang, label, priceStr, CARD_NUMBER, CARD_OWNER),
            { parse_mode: "Markdown", reply_markup: cancelKeyboard(lang) },
          );
        } else if (payload.type === "consultation") {
          const priceStr = `${CONSULTATION_PRICE.toLocaleString()} ${lang === "cyrillic" ? "сўм" : "so'm"}`;
          setState(userId, {
            step: "waiting_consultation_check",
            pendingChatId: chatId,
            pendingUsername: username,
            pendingType: "consultation",
          });
          recordEvent(userId, "mini_app_consultation_order");
          await bot.sendMessage(
            chatId,
            tPayConsultation(lang, priceStr, CARD_NUMBER, CARD_OWNER),
            { parse_mode: "Markdown", reply_markup: cancelKeyboard(lang) },
          );
        } else if (payload.type === "ai_credits") {
          const price = AI_CREDIT_PRICE;
          const priceStr = `${price.toLocaleString()} ${lang === "cyrillic" ? "сўм" : "so'm"}`;
          setState(userId, {
            step: "waiting_ai_check",
            pendingChatId: chatId,
            pendingUsername: username,
            pendingType: "ai",
          });
          recordEvent(userId, "mini_app_ai_order");
          const txt = lang === "cyrillic"
            ? `💳 *Тўлов маълумотлари*\n\nХизмат: *Qozibuva AI — 5 та савол*\nСумма: *${priceStr}*\n\nКарта рақами:\n\`${CARD_NUMBER}\`\nКарта эгаси: *${CARD_OWNER}*\n\nТўлов қилгандан сўнг *тўлов чеки (screenshot)* расмини шу чатга юборинг.`
            : `💳 *To'lov ma'lumotlari*\n\nXizmat: *Qozibuva AI — 5 ta savol*\nSumma: *${priceStr}*\n\nKarta raqami:\n\`${CARD_NUMBER}\`\nKarta egasi: *${CARD_OWNER}*\n\nTo'lov qilgandan so'ng *to'lov cheki (screenshot)* rasmini shu chatga yuboring.`;
          await bot.sendMessage(chatId, txt, {
            parse_mode: "Markdown",
            reply_markup: cancelKeyboard(lang),
          });
        } else if (payload.type === "ai_chat") {
          recordEvent(userId, "mini_app_ai_chat_start");
          const credits = getCredits(userId);
          if (credits > 0) {
            setState(userId, { step: "ai_legal_chat" });
            const privacyNote = lang === "cyrillic"
              ? "_Шахсий маълумотларингизни ёзманг._"
              : "_Shaxsiy ma'lumotlaringizni yozmang._";
            const txt = lang === "cyrillic"
              ? `⚖️ *Qozibuva AI — Ҳуқуқий Маслаҳат*\n\n${privacyNote}\n\n📊 Кредитлар: *${credits} та* (ҳар бир савол — 1 та кредит)\n\n❓ *Ҳуқуқий саволингизни ёзинг:*\n\n_Савол фақат Ўзбекистон қонунчилигига оид бўлиши керак._`
              : `⚖️ *Qozibuva AI — Huquqiy Maslahat*\n\n${privacyNote}\n\n📊 Kreditlar: *${credits} ta* (har bir savol — 1 ta kredit)\n\n❓ *Huquqiy savolingizni yozing:*\n\n_Savol faqat O'zbekiston qonunchiligiga oid bo'lishi kerak._`;
            await bot.sendMessage(chatId, txt, {
              parse_mode: "Markdown",
              reply_markup: aiCreditsKeyboard(lang),
            });
          } else {
            const price = AI_CREDIT_PRICE;
            const priceStr = `${price.toLocaleString()} ${lang === "cyrillic" ? "сўм" : "so'm"}`;
            setState(userId, {
              step: "waiting_ai_check",
              pendingChatId: chatId,
              pendingUsername: username,
              pendingType: "ai",
            });
            const txt = lang === "cyrillic"
              ? `⚖️ *Qozibuva AI*\n\n❌ Кредитлар тугади.\n\nЯнги 5 та кредит сотиб олиш учун:\n\n💳 Карта рақами:\n\`${CARD_NUMBER}\`\nКарта эгаси: *${CARD_OWNER}*\nСумма: *${priceStr}*\n\nТўлов чекини шу чатга юборинг.`
              : `⚖️ *Qozibuva AI*\n\n❌ Kreditlar tugadi.\n\nYangi 5 ta kredit sotib olish uchun:\n\n💳 Karta raqami:\n\`${CARD_NUMBER}\`\nKarta egasi: *${CARD_OWNER}*\nSumma: *${priceStr}*\n\nTo'lov chekini shu chatga yuboring.`;
            await bot.sendMessage(chatId, txt, {
              parse_mode: "Markdown",
              reply_markup: cancelKeyboard(lang),
            });
          }
        } else if (payload.type === "tahlil_request") {
          recordEvent(userId, "mini_app_tahlil_request");
          setState(userId, { step: "waiting_tahlil_doc" });
          const txt = lang === "cyrillic"
            ? `📄 *Ҳужжат таҳлили*\n\nAI ҳужжатингизни таҳлил қилиши учун:\n\n1️⃣ Ушбу чатга ҳужжатни юборинг (PDF, Word ёки расм)\n2️⃣ AI ҳужжатни ўқиб, ҳуқуқий баҳо беради\n\n⚠️ Бу хизмат *AI кредит* таlab қилади.`
            : `📄 *Hujjat tahlili*\n\nAI hujjatingizni tahlil qilishi uchun:\n\n1️⃣ Ushbu chatga hujjatni yuboring (PDF, Word yoki rasm)\n2️⃣ AI hujjatni o'qib, huquqiy baho beradi\n\n⚠️ Bu xizmat *AI kredit* talab qiladi.`;
          await bot.sendMessage(chatId, txt, { parse_mode: "Markdown" });
        } else if (payload.type === "professional_ariza") {
          recordEvent(userId, "mini_app_professional_order");
          setState(userId, {
            step: "waiting_professional_check",
            selectedServiceId: "general",
            pendingChatId: chatId,
            pendingUsername: username,
            pendingType: "professional",
          });
          const txt = lang === "cyrillic"
            ? `✍️ *Professional ariza buyurtmasi qabul qilindi!*\n\nYuristimiz siz bilan tez orada bog'lanadi va narxni aniqlashtiradi.\n\n💰 Narxi: *199 000 so'mdan 1 000 000 so'mgacha*\n(murakkabiikka qarab)`
            : `✍️ *Professional ariza buyurtmasi qabul qilindi!*\n\nYuristimiz siz bilan tez orada bog'lanadi va narxni aniqlashtiradi.\n\n💰 Narxi: *199 000 so'mdan 1 000 000 so'mgacha*\n(murakkablikka qarab)`;
          await bot.sendMessage(chatId, txt, { parse_mode: "Markdown" });
          // Notify admin
          const adminMsg = `✍️ *Professional ariza buyurtmasi (Mini App)*\n\nFoydalanuvchi: ${username ? `@${username}` : `ID: ${userId}`}\nChat ID: \`${chatId}\``;
          await bot.sendMessage(ADMIN_ID, adminMsg, { parse_mode: "Markdown" }).catch(() => {});
        }
      } catch (err) {
        logger.error({ err }, "web_app_data handleda xato");
      }
      return;
    }

    if (msg.text?.startsWith("/")) return;

    touchProfile(userId);
    try {

    // ── Admin maxsus holatlari ─────────────────────────────────────────
    if (userId === ADMIN_ID) {
      const adminState = getAdminState(ADMIN_ID);

      // /settemplate rejimi
      if (adminState.step === "setting_template" && adminState.targetCatId) {
        const catId = adminState.targetCatId;
        const cat = CATS.find((c) => c.id === catId);
        if (!msg.document) {
          await bot.sendMessage(chatId, `⚠️ Faqat fayl (hujjat) yuboring. Bekor qilish: /bekor`);
          return;
        }
        const fileId = msg.document.file_id;
        const fileName = msg.document.file_name ?? `ariza_${catId}`;
        setTemplate(catId, { fileId, fileName });
        resetAdminState(ADMIN_ID);
        await bot.sendMessage(chatId,
          `✅ *${cat?.label ?? catId}* shabloni muvaffaqiyatli yangilandi!\n\n📎 Fayl: *${fileName}*`,
          { parse_mode: "Markdown" }
        );
        logger.info({ catId, fileName }, "Admin shablon fayl yangiladi");
        return;
      }

      // /xabar (broadcast) rejimi
      if (adminState.step === "broadcasting") {
        const allIds = getAllUserIds();
        const total = allIds.length;
        resetAdminState(ADMIN_ID);

        const progressMsg = await bot.sendMessage(chatId,
          `📤 Yuborilmoqda... 0/${total}`,
        );

        let sent = 0;
        let failed = 0;
        const BATCH = 25;

        for (let i = 0; i < allIds.length; i++) {
          const uid = allIds[i]!;
          if (uid === ADMIN_ID) continue;
          try {
            if (msg.text) {
              await bot.sendMessage(uid, msg.text, { parse_mode: "Markdown" });
            } else if (msg.photo?.length) {
              const fileId = msg.photo[msg.photo.length - 1]!.file_id;
              await bot.sendPhoto(uid, fileId, { caption: msg.caption ?? undefined, parse_mode: "Markdown" });
            } else if (msg.video) {
              await bot.sendVideo(uid, msg.video.file_id, { caption: msg.caption ?? undefined, parse_mode: "Markdown" });
            } else if (msg.document) {
              await bot.sendDocument(uid, msg.document.file_id, { caption: msg.caption ?? undefined, parse_mode: "Markdown" });
            } else if (msg.sticker) {
              await bot.sendSticker(uid, msg.sticker.file_id);
            }
            sent++;
          } catch {
            failed++;
          }
          // Progress har 25 ta foydalanuvchidan keyin yangilanadi
          if ((i + 1) % BATCH === 0) {
            try {
              await bot.editMessageText(
                `📤 Yuborilmoqda... ${sent + failed}/${total}`,
                { chat_id: chatId, message_id: progressMsg.message_id }
              );
            } catch { /* ignore */ }
            await new Promise((r) => setTimeout(r, 200));
          }
        }

        await bot.editMessageText(
          `✅ *Broadcast tugadi!*\n\n` +
          `📊 Jami: *${total}* ta\n` +
          `✅ Yuborildi: *${sent}* ta\n` +
          `❌ Yetkazilmadi (bloklagan): *${failed}* ta`,
          { chat_id: chatId, message_id: progressMsg.message_id, parse_mode: "Markdown" }
        );
        logger.info({ sent, failed, total }, "Admin broadcast yubordi");
        return;
      }

      // /yuborish rejimi
      if (adminState.step === "sending_ariza" && adminState.targetUserId) {
        const targetUserId = adminState.targetUserId;
        const userLang = getLang(targetUserId);
        try {
          if (msg.document) {
            await bot.sendDocument(targetUserId, msg.document.file_id, {
              caption: t(userLang, "pro_ariza_ready"),
              parse_mode: "Markdown",
              reply_markup: backToMainKeyboard(userLang),
            });
          } else if (msg.photo?.length) {
            const fileId = msg.photo[msg.photo.length - 1]!.file_id;
            await bot.sendPhoto(targetUserId, fileId, {
              caption: t(userLang, "pro_ariza_ready"),
              parse_mode: "Markdown",
              reply_markup: backToMainKeyboard(userLang),
            });
          } else if (msg.text) {
            await bot.sendMessage(targetUserId,
              `${t(userLang, "pro_ariza_ready")}\n\n${msg.text}`,
              { parse_mode: "Markdown", reply_markup: backToMainKeyboard(userLang) }
            );
          } else {
            await bot.sendMessage(chatId, `⚠️ Fayl turi qo'llab-quvvatlanmaydi. Hujjat, rasm yoki matn yuboring.`);
            return;
          }

          resetAdminState(ADMIN_ID);
          await bot.sendMessage(chatId,
            `✅ Ariza *${targetUserId}* foydalanuvchiga muvaffaqiyatli yuborildi!`,
            { parse_mode: "Markdown" }
          );
          logger.info({ targetUserId }, "Admin professional ariza yubordi");
        } catch (err) {
          logger.error({ err, targetUserId }, "Admin ariza yuborishda xato");
          await bot.sendMessage(chatId,
            `❌ Xatolik: foydalanuvchiga yetkazib bo'lmadi (ID: ${targetUserId}).\nFoydalanuvchi botni bloklagan bo'lishi mumkin.`
          );
        }
        return;
      }
    }

    const state = getState(userId);
    const lang = getLang(userId);

    // ── Ro'yxatdan o'tmagan foydalanuvchi — avtomatik /start ────────
    if (!isRegistered(userId)) {
      resetState(userId);
      setState(userId, { step: "selecting_language" });
      await bot.sendMessage(
        chatId,
        `👋 Assalomu alaykum! / Ассалому алайкум!\n\n🌐 Iltimos, tilni tanlang / Илтимос, тилни танланг:`,
        { reply_markup: languageKeyboard() }
      );
      return;
    }

    // ── Bosh menyu tugmalari (reply keyboard) ────────────────────────
    if (msg.text && isRegistered(userId)) {
      const menuAction: Record<string, string> = {
        "Ariza bo'limi":        "menu_ariza",
        "Ариза бўлими":         "menu_ariza",
        "Konsultatsiya":         "menu_consultation",
        "Консультация":          "menu_consultation",
        "Sudlar manzillari":     "courts",
        "Судлар манзиллари":     "courts",
        "Aliment kalkulyatori":  "menu_aliment",
        "Алимент калькулятори":  "menu_aliment",
        "Biz haqimizda":         "menu_about",
        "Биз ҳақимизда":         "menu_about",
        "Chatni tozalash":       "chat_clear",
        "Чатни тозалаш":         "chat_clear",
        "Hujjat tahlili (AI)":   "menu_tahlil",
        "Хужжат таҳлили (AI)":   "menu_tahlil",
        "Qozibuva AI ⚖️":        "menu_ai",
        "Қозибува AI ⚖️":        "menu_ai",
      };
      const action = menuAction[msg.text];
      if (action) {
        resetState(userId);
        if (action === "menu_ariza") {
          await bot.sendMessage(chatId, t(lang, "ariza_menu"), { parse_mode: "Markdown", reply_markup: arizaMenuKeyboard(lang) });
        } else if (action === "menu_consultation") {
          setState(userId, { step: "selecting_consultation" });
          await bot.sendMessage(chatId, tConsultation(lang, `${CONSULTATION_PRICE.toLocaleString()} ${tSom(lang)}`, tHours(lang)), { parse_mode: "Markdown", reply_markup: confirmConsultationKeyboard(lang) });
        } else if (action === "courts") {
          await sendCourtsIntro(bot, chatId, userId);
        } else if (action === "menu_aliment") {
          await handleAliment(bot, userId, chatId, msg.message_id, "menu_aliment");
        } else if (action === "menu_ai") {
          const credits = getCredits(userId);
          const privacyNote = lang === "cyrillic"
            ? `🔒 *Maxfiylik haqida:* Ushbu chat faqat siz va Qozibuva AI o'rtasida bo'lib, hech qanday shaxs yozishmalaringizni ko'rmaydi va ma'lumotlaringiz saqlanmaydi.`
            : `🔒 *Maxfiylik haqida:* Ushbu chat faqat siz va Qozibuva AI o'rtasida bo'lib, hech qanday shaxs yozishmalaringizni ko'rmaydi va ma'lumotlaringiz saqlanmaydi.`;
          if (credits > 0) {
            setState(userId, { step: "ai_legal_chat" });
            await bot.sendMessage(chatId,
              (lang === "cyrillic"
                ? `⚖️ *Qozibuva AI — Ҳуқуқий Маслаҳат*\n\n${privacyNote}\n\n📊 Кредитлар: *${credits} та* (ҳар бир савол — 1 та кредит)\n\n❓ *Ҳуқуқий саволингизни ёзинг:*\n\n_Савол фақат Ўзбекистон қонунчилигига оид бўлиши керак. Кучини йўқотган қонун нормалари асосида эмас, амалдаги қонунчилик асосида жавоб берилади._`
                : `⚖️ *Qozibuva AI — Huquqiy Maslahat*\n\n${privacyNote}\n\n📊 Kreditlar: *${credits} ta* (har bir savol — 1 ta kredit)\n\n❓ *Huquqiy savolingizni yozing:*\n\n_Savol faqat O'zbekiston qonunchiligiga oid bo'lishi kerak. Kuchini yo'qotgan qonun normalari asosida emas, amaldagi qonunchilik asosida javob beriladi._`),
              { parse_mode: "Markdown", reply_markup: backToMainKeyboard(lang) }
            );
          } else {
            await bot.sendMessage(chatId,
              (lang === "cyrillic"
                ? `⚖️ *Qozibuva AI — Ҳуқуқий Маслаҳат*\n\n${privacyNote}\n\n⚠️ *Кредитларингиз тугади.*\n\nЯна *5 та савол* учун — *50 000 сўм* тўловни амалга ошириб, чекни юборинг.\nАдминистратор тасдиқлаганидан сўнг кредитлар дарҳол қўшилади.`
                : `⚖️ *Qozibuva AI — Huquqiy Maslahat*\n\n${privacyNote}\n\n⚠️ *Kreditlaringiz tugadi.*\n\nYana *5 ta savol* uchun — *50 000 so'm* to'lovni amalga oshirib, chekni yuboring.\nAdministrator tasdiqlaganidan so'ng kreditlar darhol qo'shiladi.`),
              { parse_mode: "Markdown", reply_markup: aiCreditsKeyboard(lang) }
            );
          }
        } else if (action === "menu_about") {
          await bot.sendMessage(chatId,
            tMainMenu(lang,
              `${SHABLON_PRICE.toLocaleString()} ${tSom(lang)}`,
              tProPrice(lang),
              `${CONSULTATION_PRICE.toLocaleString()} ${tSom(lang)}`,
              CARD_NUMBER, CARD_OWNER, tHours(lang),
            ),
            { parse_mode: "Markdown", reply_markup: backToMainKeyboard(lang) },
          );
        } else if (action === "chat_clear") {
          await bot.sendMessage(chatId, t(lang, "main_menu"), { parse_mode: "Markdown", reply_markup: mainMenuKeyboard(lang) });
        } else if (action === "menu_tahlil") {
          await bot.sendMessage(chatId,
            lang === "cyrillic"
              ? "⏳ Ушбу бўлим тез кунда ишга тушади."
              : "⏳ Ushbu bo'lim tez kunda ishga tushadi.",
            { reply_markup: backToMainKeyboard(lang) }
          );
        }
        return;
      }
    }

    // ── Hujjat tahlili ────────────────────────────────────────────────
    if (state.step === "tahlil_waiting_doc") {
      resetState(userId);
      await handleDocumentAnalysis(bot, userId, chatId, lang, msg);
      return;
    }

    // ── Aliment: maosh kiritish ───────────────────────────────────────
    if (state.step === "aliment_salary") {
      if (msg.text) {
        const handled = await handleAlimentSalaryInput(bot, userId, chatId, msg.text);
        if (handled) return;
      }
      return;
    }

    // ── Qozibuva AI — savol kutish ────────────────────────────────────
    if (state.step === "ai_legal_chat") {
      if (!msg.text) {
        await bot.sendMessage(chatId,
          lang === "cyrillic"
            ? "⚠️ Iltimos, huquqiy savolingizni matn ko'rinishida yozing."
            : "⚠️ Iltimos, huquqiy savolingizni matn ko'rinishida yozing.",
          { reply_markup: backToMainKeyboard(lang) }
        );
        return;
      }
      if (!hasCredits(userId)) {
        resetState(userId);
        await bot.sendMessage(chatId,
          lang === "cyrillic"
            ? "⚠️ *Kreditlaringiz tugadi.* Yana 5 ta savol uchun \"Qozibuva AI ⚖️\" tugmasini bosing."
            : "⚠️ *Kreditlaringiz tugadi.* Yana 5 ta savol uchun \"Qozibuva AI ⚖️\" tugmasini bosing.",
          { parse_mode: "Markdown", reply_markup: mainMenuKeyboard(lang) }
        );
        return;
      }
      // State ni "idle" ga qaytarib qo'ymaymiz — foydalanuvchi davom etishi mumkin
      setState(userId, { step: "ai_legal_chat" });
      await handleAiLegalQuestion(bot, userId, chatId, lang, msg.text);
      return;
    }

    // ── Qozibuva AI — kredit to'lov cheki ────────────────────────────
    if (state.step === "ai_legal_pay_check") {
      const hasPhoto = msg.photo && msg.photo.length > 0;
      const hasDoc   = !!msg.document;
      if (!hasPhoto && !hasDoc) {
        await bot.sendMessage(chatId, t(lang, "send_check_prompt"), { parse_mode: "Markdown" });
        return;
      }
      resetState(userId);
      const price = AI_CREDIT_PRICE.toLocaleString();
      const adminKb: TelegramBot.InlineKeyboardMarkup = {
        inline_keyboard: [[
          { text: "✅ Tasdiqlash (+5 kredit)", callback_data: `admin_ok_ai:${userId}` },
          { text: "❌ Rad etish",              callback_data: `admin_no:${userId}` },
        ]],
      };
      try {
        const caption =
          `⚖️ *Qozibuva AI kredit to'lovi*\n\n` +
          `👤 ${username}\n` +
          `🆔 ID: \`${userId}\`\n` +
          `💳 Summa: *${price} so'm* → 5 ta savol kredit\n\n` +
          `✅ Tasdiqlash tugmasi kredditni qo'shadi.`;
        if (hasPhoto) {
          await bot.sendPhoto(ADMIN_ID, msg.photo![msg.photo!.length - 1]!.file_id, {
            caption, parse_mode: "Markdown", reply_markup: adminKb,
          });
        } else {
          await bot.sendDocument(ADMIN_ID, msg.document!.file_id, {
            caption, parse_mode: "Markdown", reply_markup: adminKb,
          });
        }
        await bot.sendMessage(chatId,
          lang === "cyrillic"
            ? "⏳ *Чекингиз юборилди!*\n\nАдминистратор тасдиқлагач, кредитлар дарҳол қўшилади. Одатда *5–10 дақиқа* ичида."
            : "⏳ *Chekingiz yuborildi!*\n\nAdministrator tasdiqlagach, kreditlar darhol qo'shiladi. Odatda *5–10 daqiqa* ichida.",
          { parse_mode: "Markdown", reply_markup: backToMainKeyboard(lang) }
        );
      } catch {
        await bot.sendMessage(chatId, t(lang, "error_try_again"), { reply_markup: backToMainKeyboard(lang) });
      }
      return;
    }

    // ── To'lov cheki qabul qilish ─────────────────────────────────────
    const isWaiting =
      state.step === "waiting_shablon_check" ||
      state.step === "waiting_professional_check" ||
      state.step === "waiting_consultation_check";

    if (!isWaiting) return;

    const hasPhoto = msg.photo && msg.photo.length > 0;
    const hasDoc = !!msg.document;

    if (!hasPhoto && !hasDoc) {
      await bot.sendMessage(chatId, t(lang, "send_check_prompt"), { parse_mode: "Markdown" });
      return;
    }

    let serviceLabel = "";
    let amount = 0;
    let adminKeyboard: TelegramBot.InlineKeyboardMarkup;

    if (state.step === "waiting_shablon_check") {
      const cat = ARIZA_CATEGORIES.find((c) => c.id === state.selectedServiceId);
      serviceLabel = `📝 Shablon: *${cat?.label ?? state.selectedServiceId}*`;
      amount = SHABLON_PRICE;
      adminKeyboard = adminApproveKeyboard(userId, "shablon", state.selectedServiceId);
    } else if (state.step === "waiting_professional_check") {
      serviceLabel = `✍️ Professional ariza`;
      amount = 0;
      adminKeyboard = adminApproveKeyboard(userId, "professional");
    } else {
      serviceLabel = `📞 Konsultatsiya`;
      amount = CONSULTATION_PRICE;
      adminKeyboard = adminApproveKeyboard(userId, "consultation");
    }

    const amountText = amount > 0
      ? `💰 Summa: *${amount.toLocaleString()} so'm*\n`
      : `💰 Narxi: *${PROFESSIONAL_PRICE_LABEL}*\n`;
    const adminText =
      `🔔 *Yangi to'lov cheki!*\n\n` +
      `👤 Foydalanuvchi: ${username}\n` +
      `🆔 ID: \`${userId}\`\n` +
      `${serviceLabel}\n` +
      `${amountText}\n` +
      `Chekni tekshirib tasdiqlang yoki rad eting:`;

    try {
      if (hasPhoto) {
        const fileId = msg.photo![msg.photo!.length - 1]!.file_id;
        await bot.sendPhoto(ADMIN_ID, fileId, {
          caption: adminText,
          parse_mode: "Markdown",
          reply_markup: adminKeyboard!,
        });
      } else {
        await bot.sendDocument(ADMIN_ID, msg.document!.file_id, {
          caption: adminText,
          parse_mode: "Markdown",
          reply_markup: adminKeyboard!,
        });
      }

      await bot.sendMessage(chatId, t(lang, "check_sent"), { parse_mode: "Markdown" });
      logger.info({ userId, username, step: state.step, serviceId: state.selectedServiceId }, "Chek adminga yuborildi");
    } catch (err) {
      logger.error({ err }, "Adminga chek yuborishda xato");
      await bot.sendMessage(chatId, t(lang, "error_try_again"), { reply_markup: backToMainKeyboard(lang) });
    }

    } catch (err) {
      logger.error({ err, userId }, "Message handleda xato");
    }
  });
}

// ── PDF cache isitish ────────────────────────────────────────────────────────
export async function warmPdfCache(): Promise<void> {
  const generators: Record<string, () => string> = {
    divorce: generateDivorceTemplate,
    aliment: generateAlimentTemplate,
    radar: generateRadarTemplate,
  };
  for (const [catId, gen] of Object.entries(generators)) {
    try {
      const buf = await generatePdfBuffer(gen());
      pdfCache.set(catId, buf);
      logger.info({ catId }, "PDF cache isitildi");
    } catch (err) {
      logger.error({ err, catId }, "PDF cache isitishda xato");
    }
  }
}

// ── Shablon hujjatlar ────────────────────────────────────────────────────────
const TEMPLATES_DIR = path.join(process.cwd(), "assets", "templates");

function findLocalTemplate(catId: string): { filePath: string; fileName: string } | null {
  const extensions = [".docx", ".doc", ".pdf"];
  for (const ext of extensions) {
    const filePath = path.join(TEMPLATES_DIR, `${catId}${ext}`);
    if (fs.existsSync(filePath)) {
      return { filePath, fileName: `${catId}${ext}` };
    }
  }
  return null;
}

async function sendShablonDocument(
  bot: TelegramBot,
  chatId: number,
  catId: string,
  lang: Lang = "latin",
): Promise<void> {
  const caption = t(lang, "doc_caption");

  // 1-ustuvorlik: diskdagi asl Word fayl
  const local = findLocalTemplate(catId);
  if (local) {
    await bot.sendDocument(
      chatId,
      fs.createReadStream(local.filePath),
      { caption, reply_markup: backToMainKeyboard(lang) },
      { filename: local.fileName },
    );
    return;
  }

  // 2-ustuvorlik: admin yuklagan file_id
  const stored = getTemplate(catId);
  if (stored) {
    await bot.sendDocument(chatId, stored.fileId, {
      caption,
      reply_markup: backToMainKeyboard(lang),
    });
    return;
  }

  // 3-ustuvorlik: PDF cache (fallback)
  const cached = pdfCache.get(catId);
  if (!cached) {
    const errMsg = lang === "cyrillic"
      ? "⚠️ Шаблон топилмади. Илтимос админ билан боғланинг."
      : "⚠️ Shablon topilmadi. Iltimos admin bilan bog'laning.";
    await bot.sendMessage(chatId, errMsg, { reply_markup: backToMainKeyboard(lang) });
    return;
  }

  await bot.sendDocument(
    chatId,
    cached,
    { caption, reply_markup: backToMainKeyboard(lang) },
    { filename: `shablon_ariza_${catId}.pdf`, contentType: "application/pdf" }
  );
}

function generateDivorceTemplate(): string {
  return `Fuqarolik ishlari bo'yicha _________________________
tumanlararo sudiga

Da'vogar:  ____________________________________
           ____________________________________
Manzil:    ____________________________________
           ____________________________________
Tel:       ____________________________________

Javobgar:  ____________________________________
           ____________________________________
Manzil:    ____________________________________
           ____________________________________
Tel:       ____________________________________


D A ' V O   A R I Z A
(Nikohdan ajratish haqida)


Men va javobgar o'rtamizdagi qonuniy nikoh _________________ tumani FHDY bo'limi
tomonidan _____________ kuni ________________-sonli dalolatnoma bilan qayd etilgan.

Birgalikdagi turmushimizdan __________ yilda tug'ilgan _______________________________
ismli farzandimiz bor. Uning tug'ilganligi to'g'risidagi guvohnoma _____________ tumani
FHDY bo'limi tomonidan _______________-sonli seriya raqamli guvohnoma berilgan.

___________________________________________________________________________
___________________________________________________________________________
___________________________________________________________________________
(Nikohni saqlab qolish imkoni yo'qligiga sabab)

Men _____________ kundan beri javobgar bilan bir oila sifatida yashamayman.

O'zbekiston Respublikasi Oila kodeksining 41-moddasiga binoan, agar sud er va xotinning
bundan buyon birgalikda yashashiga va oilani saqlab qolishga imkoniyat yo'q deb topsa,
ularni nikohdan ajratadi.

Yuqoridagilarga ko'ra, O'zbekiston Respublikasi Oila Kodeksining 41-moddasiga,
O'zbekiston Respublikasi Fuqarolik protsessual kodeksining 188, 189-191-moddalariga asosan


SO'RAYMAN:

Javobgar bilan o'rtamizdagi _____________ tumani tomonidan _______________ kuni
___________-son bilan qayd etilgan nikohdan ajratishni.


Ilova qilinayotgan hujjatlar:
1. Da'vo ariza nusxasi;
2. Nikoh qayd etilganligi haqida guvohnoma;
3. Tug'ilganlik haqida guvohnoma nusxasi;
4. Boshqa hujjatlar.


_________________________________
(F.I.O.)

__________
(imzo)

"___" _____________ 202___ yil`;
}

function generateAlimentTemplate(): string {
  return `                                        Fuqarolik ishlari bo'yicha ___________
                                        tumanlararo sudiga


                                        Da'vogar:      ____________________
                                        ______________________________
                                        Manzil:      ______________________
                                        ______________________________
                                        tel: __________________________


                                        Javobgar:       ___________________
                                        ______________________________
                                        Manzil:       _____________________
                                        ______________________________
                                        tel: __________________________

                                  A R I Z A
                         (Aliment undirish to'g'risida)

      Men va javobgar  _________________________________  bilan  o'rtamizdagi
qonuniy nikoh  _________ tumani FHDY bo'limi  tomonidan  ______________  kuni
rasmiylashtiriIgan.
      Birgalikdagi  turmushimizdan  ____________   yilda   ______________________________
______________________________  tug'ildi.
      Turmush  o'rtog'im  bilan  __  yil  birga  yashadik  va  oiladagi  muntazam
kelishmovchiliklar  sababli  _____  yil  ______  oyidan  buyon  bIrga  yashamaymiz
hamda bolalarim bilan ota  uyimga  ketishga  majbur  bo'ldim.

                                  SO'RAYMAN:

       Farzandimning  moddiy  ta'minoti  uchun   javobgar   _________________
___________________dan  har oyda  ish haqi va  boshqa  daromadlaridan  qonunda
belgilangan tartibda aliment undirish to'g'risida sud  buyrug'i  chiqarishingizni.


Ilova:
    1. Ariza nusxasi
    2. Nikoh qayd etilganligi haqida guvohnoma.
    3. Tug'ilganlik haqida guvohnoma nusxasi.



                                            ________  ______________________

                                                   202__ yil  "___" _________`;
}

function generateRadarTemplate(): string {
  return `Jinoyat ishlari bo'yicha ______________________________
______________________________ SUDIGA


Arizachi: ______________________________
Yashash manzil: ______________________________
______________________________
Telefon raqam: ______________________________


A R I Z A
(______________________________-sonli jarimani bekor qilish to'g'risida)


Men, ______________________________, ______________________________ rusumli avtomobil
davlat raqami ______________________________ avtomobilga ______________________________
viloyati IIB YHXB MAI inspektori ______________________________ tomonidan MJtKning
128X3-moddasi 1-qismi bilan huquqbuzarlik sodir etganlikda aybdor deb topildim.

Ushbu ______________________________-sonli jarima solish to'g'risidagi qarorni
O'zbekiston Respublikasining amaldagi qonunlari buzilgan deb hisoblaymiz.

Yuqoridagi qonuniy faktlarga asosan, O'zbekiston Respublikasi MJtKning 271-moddasi
1-bandiga asosan ______________________________-sonli qarorni bekor qilishingizni so'rayman.


Ilova:
- Haydovchilik guvohnomasi;
- Avtomototransport vositasi ro'yxatdan o'tkazilganligi to'g'risidagi guvohnoma;
- Shaxsni tasdiqlovchi hujjat (pasport/ID karta);
- ______________________________-sonli jarima qarori.


IMZO:   _________________

"___" _____________ 202___ yil`;
}
