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
} from "./config";
import { getState, setState, resetState, getAdminState, setAdminState, resetAdminState } from "./state";
import {
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
  contactKeyboard,
} from "./keyboards";
import { logger } from "../lib/logger";
import { handleCourts, sendCourtsIntro } from "./courtsHandler";
import { handleAliment, handleAlimentSalaryInput } from "./alimentHandler";
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
import { addUser, getUserCount } from "./userCounter";

const FONT_PATH = path.join(process.cwd(), "assets", "NotoSans-Regular.ttf");
const FONT_BUFFER: Buffer = fs.readFileSync(FONT_PATH);

// adminMsgId → foydalanuvchi chatId (murojat javoblari uchun)
const contactReplyMap = new Map<number, number>();

function generatePdfBuffer(content: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 60, size: "A4" });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
    doc.registerFont("NotoSans", FONT_BUFFER);
    doc.fontSize(11).font("NotoSans").text(content, { lineGap: 4 });
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

export function setupHandlers(bot: TelegramBot): void {

  // ── /start ────────────────────────────────────────────────────────────────
  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from?.id ?? chatId;

    // Admin — ro'yxatdan o'tkazmaslik, to'g'ri bosh menyu
    if (userId === ADMIN_ID) {
      resetState(userId);
      await bot.sendMessage(
        chatId,
        `👋 Assalomu alaykum, Admin!\n\nBosh menyu:`,
        { parse_mode: "Markdown", reply_markup: mainMenuKeyboard("latin") }
      );
      return;
    }

    resetState(userId);

    // Har doim til tanlash so'raladi (qaytib kelgan foydalanuvchi ham til o'zgartira oladi)
    setState(userId, { step: "selecting_language" });
    await bot.sendMessage(
      chatId,
      `👋 Assalomu alaykum! / Ассалому алайкум!\n\n🌐 Iltimos, tilni tanlang / Илтимос, тилни танланг:`,
      { reply_markup: languageKeyboard() }
    );
  });

  // ── /help ────────────────────────────────────────────────────────────────
  bot.onText(/\/help/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from?.id ?? chatId;
    const lang = getLang(userId);
    const helpText = lang === "cyrillic"
      ? `ℹ️ *Yordam*\n\n*Buyruqlar:*\n/start — Botni ishga tushirish\n/help — Yordam\n/clean — Chatni tozalash\n\n*Xizmatlar:*\nAriza bo'limi — tayyor shablon yoki professional ariza\nKonsultatsiya — yurist bilan maslahat\nSudlar manzillari — O'zbekiston sudlari\nAliment kalkulyatori — aliment miqdorini hisoblash\n\n*Savol va takliflar uchun "Adminga murojat" tugmasini bosing.*`
      : `ℹ️ *Yordam*\n\n*Buyruqlar:*\n/start — Botni ishga tushirish\n/help — Yordam\n/clean — Chatni tozalash\n\n*Xizmatlar:*\nAriza bo'limi — tayyor shablon yoki professional ariza\nKonsultatsiya — yurist bilan maslahat\nSudlar manzillari — O'zbekiston sudlari\nAliment kalkulyatori — aliment miqdorini hisoblash\n\n*Savol va takliflar uchun "Adminga murojat" tugmasini bosing.*`;
    await bot.sendMessage(chatId, helpText, {
      parse_mode: "Markdown",
      reply_markup: isRegistered(userId) ? mainMenuKeyboard(lang) : undefined,
    });
  });

  // ── /clean ───────────────────────────────────────────────────────────────
  bot.onText(/\/clean/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from?.id ?? chatId;
    const lang = getLang(userId);
    resetState(userId);
    await bot.sendMessage(chatId, t(lang, "main_menu"), {
      parse_mode: "Markdown",
      reply_markup: isRegistered(userId) ? mainMenuKeyboard(lang) : undefined,
    });
  });

  // ── Admin: /yuborish <userId> ─────────────────────────────────────────────
  bot.onText(/\/yuborish(?:\s+(\d+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const adminId = msg.from?.id ?? chatId;
    if (adminId !== ADMIN_ID) return;

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
      { parse_mode: "Markdown" }
    );
  });

  // ── Admin: /settemplate <catId> ───────────────────────────────────────────
  bot.onText(/\/settemplate(?:\s+(\w+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    if ((msg.from?.id ?? chatId) !== ADMIN_ID) return;

    const catId = match?.[1];
    if (!catId) {
      const list = CATS.map((c) => `• \`/settemplate ${c.id}\` — ${c.label}`).join("\n");
      await bot.sendMessage(chatId,
        `📋 *Mavjud kategoriyalar:*\n\n${list}\n\nBirini tanlang va fayl yuboring.`,
        { parse_mode: "Markdown" }
      );
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
      { parse_mode: "Markdown" }
    );
  });

  // ── Admin: /listtemplates ─────────────────────────────────────────────────
  bot.onText(/\/listtemplates/, async (msg) => {
    const chatId = msg.chat.id;
    if ((msg.from?.id ?? chatId) !== ADMIN_ID) return;

    const templates = listTemplates();
    if (templates.length === 0) {
      await bot.sendMessage(chatId, `📋 Hozircha hech qanday shablon saqlanmagan.`);
      return;
    }
    const list = templates.map((t) => `• *${t.catId}*: ${t.fileName}`).join("\n");
    await bot.sendMessage(chatId, `📋 *Saqlangan shablonlar:*\n\n${list}`, { parse_mode: "Markdown" });
  });

  // ── Admin: /bekor ─────────────────────────────────────────────────────────
  bot.onText(/\/bekor/, async (msg) => {
    const chatId = msg.chat.id;
    const adminId = msg.from?.id ?? chatId;
    if (adminId !== ADMIN_ID) return;

    resetAdminState(ADMIN_ID);
    await bot.sendMessage(chatId, `✅ Amal bekor qilindi.`);
  });

  // ── /help ─────────────────────────────────────────────────────────────────
  bot.onText(/\/help/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from?.id ?? chatId;
    const lang = getLang(userId);
    await bot.sendMessage(
      chatId,
      tHelp(
        lang,
        `${SHABLON_PRICE.toLocaleString()} ${tSom(lang)}`,
        tProPrice(lang),
        `${CONSULTATION_PRICE.toLocaleString()} ${tSom(lang)}`,
      ),
      { parse_mode: "Markdown", reply_markup: backToMainKeyboard(lang) }
    );
  });

  // ── Callback query handler ────────────────────────────────────────────────
  bot.on("callback_query", async (query) => {
    const chatId = query.message?.chat.id;
    const messageId = query.message?.message_id;
    const userId = query.from.id;
    const data = query.data ?? "";
    const username = query.from.username
      ? `@${query.from.username}`
      : (query.from.first_name ?? "Noma'lum");

    if (!chatId || !messageId) return;

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
        await handleCourts(bot, query, data, chatId, messageId);
        return;
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

      // ── Til tanlash ────────────────────────────────────────────────────
      if (data === "lang_latin" || data === "lang_cyrillic") {
        const selectedLang: Lang = data === "lang_latin" ? "latin" : "cyrillic";
        setProfile(userId, { lang: selectedLang });
        addUser(userId);
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

      // ── Adminga murojat ───────────────────────────────────────────────
      if (data === "menu_contact") {
        await safeEdit(
          bot, chatId, messageId,
          t(lang, "contact_title"),
          { parse_mode: "Markdown", reply_markup: contactKeyboard(lang) }
        );
        return;
      }

      if (data === "contact_write") {
        setState(userId, { step: "writing_to_admin" });
        await safeEdit(
          bot, chatId, messageId,
          t(lang, "contact_write_prompt"),
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
        await bot.sendMessage(targetUserId,
          t(userLang, "pro_approved_msg"),
          { parse_mode: "Markdown", reply_markup: backToMainKeyboard(userLang) }
        );
        resetState(targetUserId);
        return;
      }

      // ── Admin: konsultatsiya tasdiqlash  admin_ok_c:<userId> ──────────
      if (data.startsWith("admin_ok_c:")) {
        const targetUserId = parseInt(data.split(":")[1]!);
        const userLang = getLang(targetUserId);
        await bot.sendMessage(chatId, `✅ Tasdiqlandi! Telefon raqam yuborildi.`);
        await bot.sendMessage(targetUserId,
          tApprovedConsultation(userLang, CONSULTATION_PHONE, tHours(userLang)),
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

    } catch (err) {
      logger.error({ err, data, userId }, "Callback query handleda xato");
    }
  });

  // ── Message handler ───────────────────────────────────────────────────────
  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from?.id ?? chatId;
    const username = msg.from?.username
      ? `@${msg.from.username}`
      : (msg.from?.first_name ?? "Noma'lum");

    if (msg.text?.startsWith("/")) return;

    try {

    // ── Admin maxsus holatlari ─────────────────────────────────────────
    if (userId === ADMIN_ID) {
      const adminState = getAdminState(ADMIN_ID);

      // Admin murojatga reply qilsa → foydalanuvchiga yuborish
      const repliedToId = msg.reply_to_message?.message_id;
      if (repliedToId && contactReplyMap.has(repliedToId)) {
        const targetChatId = contactReplyMap.get(repliedToId)!;
        const userLang = getLang(targetChatId);
        try {
          if (msg.text) {
            await bot.sendMessage(targetChatId,
              `${t(userLang, "admin_reply_label")}\n\n${msg.text}`,
              { parse_mode: "Markdown", reply_markup: backToMainKeyboard(userLang) }
            );
          } else if (msg.document) {
            await bot.sendDocument(targetChatId, msg.document.file_id, {
              caption: t(userLang, "admin_reply_label"),
              parse_mode: "Markdown",
              reply_markup: backToMainKeyboard(userLang),
            });
          } else if (msg.photo?.length) {
            await bot.sendPhoto(targetChatId, msg.photo[msg.photo.length - 1]!.file_id, {
              caption: t(userLang, "admin_reply_label"),
              parse_mode: "Markdown",
              reply_markup: backToMainKeyboard(userLang),
            });
          }
          await bot.sendMessage(chatId, `✅ Javobingiz foydalanuvchiga yetkazildi.`);
        } catch {
          await bot.sendMessage(chatId, `❌ Foydalanuvchiga yetkazib bo'lmadi. Botni bloklagan bo'lishi mumkin.`);
        }
        return;
      }

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

    // ── Ro'yxatdan o'tmagan foydalanuvchi ────────────────────────────
    if (!isRegistered(userId)) {
      await bot.sendMessage(chatId,
        `Iltimos, botni qayta ishga tushiring: /start\n\nИлтимос, ботни қайта ишга туширинг: /start`,
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
        "Adminga murojat":       "menu_contact",
        "Админга мурожат":       "menu_contact",
        "Biz haqimizda":         "menu_about",
        "Биз ҳақимизда":         "menu_about",
        "Chatni tozalash":       "chat_clear",
        "Чатни тозалаш":         "chat_clear",
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
        } else if (action === "menu_contact") {
          await bot.sendMessage(chatId, t(lang, "contact_title"), { parse_mode: "Markdown", reply_markup: contactKeyboard(lang) });
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
        }
        return;
      }
    }

    // ── Aliment: maosh kiritish ───────────────────────────────────────
    if (state.step === "aliment_salary") {
      if (msg.text) {
        const handled = await handleAlimentSalaryInput(bot, userId, chatId, msg.text);
        if (handled) return;
      }
      return;
    }

    // ── Adminga xabar yozish ──────────────────────────────────────────
    if (state.step === "writing_to_admin") {
      if (!msg.text) {
        await bot.sendMessage(chatId, t(lang, "contact_only_text"));
        return;
      }
      resetState(userId);
      try {
        const sent = await bot.sendMessage(ADMIN_ID,
          `💬 *Foydalanuvchi murojati*\n\n` +
          `👤 ${username}\n` +
          `🆔 ID: \`${userId}\`\n\n` +
          `📝 Xabar:\n${msg.text}\n\n` +
          `↩️ _Javob berish uchun shu xabarga Reply qiling_`,
          { parse_mode: "Markdown" }
        );
        contactReplyMap.set(sent.message_id, chatId);
        await bot.sendMessage(chatId,
          t(lang, "contact_sent"),
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
