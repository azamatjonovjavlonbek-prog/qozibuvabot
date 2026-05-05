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
  mainMenuKeyboard,
  arizaMenuKeyboard,
  shablonListKeyboard,
  confirmShablonKeyboard,
  confirmProfessionalKeyboard,
  confirmConsultationKeyboard,
  cancelKeyboard,
  adminApproveKeyboard,
  backToMainKeyboard,
} from "./keyboards";
import { logger } from "../lib/logger";
import { getTemplate, setTemplate, listTemplates } from "./templateStore";
import { ARIZA_CATEGORIES as CATS } from "./config";

const FONT_PATH = path.join(process.cwd(), "assets", "NotoSans-Regular.ttf");

function generatePdfBuffer(content: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 60, size: "A4", font: FONT_PATH });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
    doc.fontSize(10).text(content, { lineGap: 2 });
    doc.end();
  });
}

// Pre-generate PDF buffers at startup so delivery is instant
const pdfCache = new Map<string, Buffer>();

export async function warmPdfCache(): Promise<void> {
  const entries: Array<[string, string]> = [
    ["divorce", generateDivorceTemplate()],
    ["aliment", generateAlimentTemplate()],
    ["radar",   generateRadarTemplate()],
  ];
  await Promise.all(entries.map(async ([id, content]) => {
    pdfCache.set(id, await generatePdfBuffer(content));
  }));
  logger.info("PDF cache warmed (%d templates)", pdfCache.size);
}

export function setupHandlers(bot: TelegramBot): void {

  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from?.id ?? chatId;
    resetState(userId);
    await bot.sendMessage(
      chatId,
      `👋 Assalomu alaykum!\n\nSiz *QoziBuva Huquqiy Xizmatlar Bot*ga xush kelibsiz.\n\nQuyidagi xizmatlardan birini tanlang:`,
      { parse_mode: "Markdown", reply_markup: mainMenuKeyboard() }
    );
  });

  // ── Admin: /yuborish <userId> — professional arizani foydalanuvchiga yuborish
  bot.onText(/\/yuborish(?:\s+(\d+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const adminId = msg.from?.id ?? chatId;

    if (adminId !== ADMIN_ID) return;

    const targetUserId = match?.[1] ? parseInt(match[1]) : null;

    if (!targetUserId) {
      await bot.sendMessage(
        chatId,
        `⚠️ Foydalanish: /yuborish <userId>\n\nMisol: /yuborish 123456789\n\nFoydalanuvchi ID ni to'lov cheki xabaridan topishingiz mumkin.`,
        { parse_mode: "Markdown" }
      );
      return;
    }

    setAdminState(adminId, { step: "sending_ariza", targetUserId });
    await bot.sendMessage(
      chatId,
      `✅ Tayyor! Endi *${targetUserId}* foydalanuvchiga yubormoqchi bo'lgan ariza faylini (Word, PDF yoki boshqa) shu chatga yuboring.\n\nBekor qilish uchun: /bekor`,
      { parse_mode: "Markdown" }
    );
  });

  // ── Admin: /bekor — yuborish/o'rnatish rejimini bekor qilish
  bot.onText(/\/bekor/, async (msg) => {
    const chatId = msg.chat.id;
    const adminId = msg.from?.id ?? chatId;
    if (adminId !== ADMIN_ID) return;
    resetAdminState(adminId);
    await bot.sendMessage(chatId, `❌ Amal bekor qilindi.`);
  });

  // ── Admin: /settemplate <catId> — shablon faylini yangilash
  bot.onText(/\/settemplate(?:\s+(\S+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const adminId = msg.from?.id ?? chatId;
    if (adminId !== ADMIN_ID) return;

    const catId = match?.[1]?.toLowerCase();
    const validIds = CATS.map((c) => c.id);

    if (!catId || !validIds.includes(catId as typeof CATS[number]["id"])) {
      const catList = CATS.map((c) => `• \`/settemplate ${c.id}\` — ${c.label}`).join("\n");
      await bot.sendMessage(chatId,
        `⚠️ To'g'ri foydalanish:\n\n${catList}\n\nMisol: /settemplate divorce`,
        { parse_mode: "Markdown" }
      );
      return;
    }

    const cat = CATS.find((c) => c.id === catId)!;
    setAdminState(adminId, { step: "setting_template", targetCatId: catId });
    await bot.sendMessage(chatId,
      `📂 *${cat.label}* shabloni uchun yangi fayl yuboring.\n\n` +
      `(PDF, Word yoki boshqa format — fayl asl holatda saqlanadi)\n\n` +
      `Bekor qilish: /bekor`,
      { parse_mode: "Markdown" }
    );
  });

  // ── Admin: /templates — o'rnatilgan shablonlar ro'yxati
  bot.onText(/\/templates/, async (msg) => {
    const chatId = msg.chat.id;
    const adminId = msg.from?.id ?? chatId;
    if (adminId !== ADMIN_ID) return;

    const stored = listTemplates();
    const lines = CATS.map((c) => {
      const t = stored[c.id];
      return t
        ? `✅ \`${c.id}\` — ${c.label}: *${t.fileName}*`
        : `❌ \`${c.id}\` — ${c.label}: o'rnatilmagan (PDF fallback)`;
    });
    await bot.sendMessage(chatId,
      `📋 *Shablon fayllar holati:*\n\n${lines.join("\n")}`,
      { parse_mode: "Markdown" }
    );
  });

  // ── Admin: /yordam — admin buyruqlari ro'yxati
  bot.onText(/\/yordam/, async (msg) => {
    const chatId = msg.chat.id;
    const adminId = msg.from?.id ?? chatId;
    if (adminId !== ADMIN_ID) return;
    await bot.sendMessage(
      chatId,
      `📋 *Admin buyruqlari:*\n\n` +
      `/yuborish <userId> — professional arizani foydalanuvchiga yuborish\n` +
      `/settemplate <catId> — shablon faylini yangilash\n` +
      `/templates — o'rnatilgan fayllar holati\n` +
      `/bekor — joriy amalni bekor qilish\n` +
      `/yordam — shu ro'yxat\n\n` +
      `*Shablon ID lar:* divorce | aliment | radar`,
      { parse_mode: "Markdown" }
    );
  });

  // Helper: edit message text, fall back to new message if editing fails
  async function safeEdit(
    chatId: number,
    messageId: number,
    text: string,
    opts: TelegramBot.EditMessageTextOptions,
  ): Promise<void> {
    try {
      await bot.editMessageText(text, { chat_id: chatId, message_id: messageId, ...opts });
    } catch {
      await bot.sendMessage(chatId, text, {
        parse_mode: opts.parse_mode,
        reply_markup: opts.reply_markup as TelegramBot.InlineKeyboardMarkup | undefined,
      });
    }
  }

  bot.on("callback_query", async (query) => {
    const chatId = query.message?.chat.id;
    const messageId = query.message?.message_id;
    const userId = query.from.id;
    const username = query.from.username
      ? `@${query.from.username}`
      : (query.from.first_name ?? "Noma'lum");
    const data = query.data ?? "";

    if (!chatId || !messageId) return;

    try {
      await bot.answerCallbackQuery(query.id);
    } catch { /* ignore stale callback */ }

    try {
      // ── Bosh menyu ────────────────────────────────────────────────────
      if (data === "back_main") {
        resetState(userId);
        await safeEdit(chatId, messageId,
          `🏠 *Bosh menyu*\n\nQuyidagi xizmatlardan birini tanlang:`,
          { parse_mode: "Markdown", reply_markup: mainMenuKeyboard() }
        );
        return;
      }

      // ── Ariza bo'limi ──────────────────────────────────────────────────
      if (data === "menu_ariza") {
        setState(userId, { step: "idle" });
        await safeEdit(chatId, messageId,
          `📄 *Ariza bo'limi*\n\nQuyidagi ikki xizmatdan birini tanlang:\n\n` +
          `📝 *Shablon ariza* — tayyor shablon, ba'zi ma'lumotlarni o'zingiz to'ldirasiz.\n` +
          `✍️ *Professional ariza* — yurist tomonidan to'liq yozib beriladi.`,
          { parse_mode: "Markdown", reply_markup: arizaMenuKeyboard() }
        );
        return;
      }

      // ── Shablon ariza ro'yxati ─────────────────────────────────────────
      if (data === "menu_shablon") {
        setState(userId, { step: "selecting_shablon" });
        await safeEdit(chatId, messageId,
          `📝 *Shablon ariza*\n\nNarxi: *${SHABLON_PRICE.toLocaleString()} so'm*\n\nTayyor shablon faylingiz yuboriladi. Undagi bo'sh joylarni o'zingiz to'ldirasiz.\n\nQaysi mavzu bo'yicha ariza kerak?`,
          { parse_mode: "Markdown", reply_markup: shablonListKeyboard() }
        );
        return;
      }

      if (data.startsWith("shablon_")) {
        const catId = data.replace("shablon_", "");
        const cat = ARIZA_CATEGORIES.find((c) => c.id === catId);
        if (!cat) return;

        setState(userId, { step: "confirming_shablon", selectedServiceId: catId });
        await safeEdit(chatId, messageId,
          `📝 *${cat.label} — Shablon ariza*\n\n` +
          `Tayyor shablon faylini olasiz va undagi bo'sh joylarni o'zingiz to'ldirasiz.\n\n` +
          `💰 Narxi: *${SHABLON_PRICE.toLocaleString()} so'm*`,
          { parse_mode: "Markdown", reply_markup: confirmShablonKeyboard(catId) }
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
        await safeEdit(chatId, messageId,
          `💳 *To'lov ma'lumotlari*\n\n` +
          `Xizmat: *${cat.label} (Shablon)*\n` +
          `Summa: *${SHABLON_PRICE.toLocaleString()} so'm*\n\n` +
          `🏦 Karta raqami:\n\`${CARD_NUMBER}\`\n` +
          `👤 Karta egasi: *${CARD_OWNER}*\n\n` +
          `✅ To'lov qilgandan so'ng *to'lov cheki (screenshot) rasmini* shu chatga yuboring.`,
          { parse_mode: "Markdown", reply_markup: cancelKeyboard() }
        );
        return;
      }

      // ── Professional ariza ─────────────────────────────────────────────
      if (data === "menu_professional") {
        setState(userId, { step: "confirming_professional", selectedServiceId: "general" });
        await safeEdit(chatId, messageId,
          `✍️ *Professional ariza*\n\n` +
          `Yuristimiz sizning holatIngizga mos ariza yozib beradi.\n\n` +
          `💰 Narxi: *${PROFESSIONAL_PRICE_LABEL}*\n\n` +
          `📌 Buyurtma bergandan so'ng yuristimiz siz bilan bog'lanib, kerakli ma'lumotlarni so'raydi va tayyor arizani bot orqali yuboradi.`,
          { parse_mode: "Markdown", reply_markup: confirmProfessionalKeyboard() }
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
        await safeEdit(chatId, messageId,
          `💳 *To'lov ma'lumotlari*\n\n` +
          `Xizmat: *Professional ariza*\n` +
          `Narxi: *${PROFESSIONAL_PRICE_LABEL}*\n\n` +
          `🏦 Karta raqami:\n\`${CARD_NUMBER}\`\n` +
          `👤 Karta egasi: *${CARD_OWNER}*\n\n` +
          `✅ To'lov qilgandan so'ng *to'lov cheki (screenshot) rasmini* shu chatga yuboring.\n\n` +
          `ℹ️ Yuristimiz to'lov tasdiqlangach narxni aniqlashtiradi.`,
          { parse_mode: "Markdown", reply_markup: cancelKeyboard() }
        );
        return;
      }

      // ── Konsultatsiya ──────────────────────────────────────────────────
      if (data === "menu_consultation") {
        setState(userId, { step: "selecting_consultation" });
        await safeEdit(chatId, messageId,
          `📞 *Konsultatsiya xizmati*\n\nHuquqiy masalalaringiz bo'yicha mutaxassisimiz bilan bog'laning.\n\n` +
          `💰 Narxi: *${CONSULTATION_PRICE.toLocaleString()} so'm*\n` +
          `🕐 Ish vaqti: *${CONSULTATION_HOURS}*\n\n` +
          `To'lovdan so'ng telefon raqamimiz yuboriladi.`,
          { parse_mode: "Markdown", reply_markup: confirmConsultationKeyboard() }
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
        await safeEdit(chatId, messageId,
          `💳 *To'lov ma'lumotlari*\n\n` +
          `Xizmat: *Konsultatsiya*\n` +
          `Summa: *${CONSULTATION_PRICE.toLocaleString()} so'm*\n\n` +
          `🏦 Karta raqami:\n\`${CARD_NUMBER}\`\n` +
          `👤 Karta egasi: *${CARD_OWNER}*\n\n` +
          `✅ To'lov qilgandan so'ng *to'lov cheki (screenshot) rasmini* shu chatga yuboring.`,
          { parse_mode: "Markdown", reply_markup: cancelKeyboard() }
        );
        return;
      }

      // ── Admin: shablon tasdiqlash  admin_ok_s:<userId>:<catId> ────────
      if (data.startsWith("admin_ok_s:")) {
        const parts = data.split(":");
        const targetUserId = parseInt(parts[1]!);
        const catId = parts[2]!;
        const cat = ARIZA_CATEGORIES.find((c) => c.id === catId);

        try { await bot.editMessageReplyMarkup({ inline_keyboard: [] }, { chat_id: chatId, message_id: messageId }); } catch { /* ignore */ }

        if (!cat) {
          await bot.sendMessage(chatId, `⚠️ Kategoriya topilmadi: ${catId}`);
          return;
        }

        await bot.sendMessage(chatId, `✅ Tasdiqlandi! Shablon ariza yuborilmoqda.`);
        await bot.sendMessage(targetUserId,
          `✅ *To'lovingiz tasdiqlandi!*\n\n📄 *${cat.label}* shablon arizasi quyida yuborilmoqda...`,
          { parse_mode: "Markdown" }
        );
        await sendShablonDocument(bot, targetUserId, catId);
        resetState(targetUserId);
        return;
      }

      // ── Admin: professional tasdiqlash  admin_ok_p:<userId> ───────────
      if (data.startsWith("admin_ok_p:")) {
        const targetUserId = parseInt(data.split(":")[1]!);

        try { await bot.editMessageReplyMarkup({ inline_keyboard: [] }, { chat_id: chatId, message_id: messageId }); } catch { /* ignore */ }
        await bot.sendMessage(chatId,
          `✅ Tasdiqlandi!\n\n📌 Endi foydalanuvchi (ID: \`${targetUserId}\`) bilan bog'laning va ariza uchun kerakli ma'lumotlarni so'rang.\n\n` +
          `Ariza tayyor bo'lgach: /yuborish ${targetUserId}`,
          { parse_mode: "Markdown" }
        );
        await bot.sendMessage(targetUserId,
          `✅ *To'lovingiz tasdiqlandi!*\n\n✍️ *Professional ariza* buyurtmangiz qabul qilindi.\n\n` +
          `Yuristimiz tez orada siz bilan bog'lanib, kerakli ma'lumotlarni so'raydi. Iltimos, kutib turing.`,
          { parse_mode: "Markdown", reply_markup: backToMainKeyboard() }
        );
        resetState(targetUserId);
        return;
      }

      // ── Admin: konsultatsiya tasdiqlash  admin_ok_c:<userId> ──────────
      if (data.startsWith("admin_ok_c:")) {
        const targetUserId = parseInt(data.split(":")[1]!);

        try { await bot.editMessageReplyMarkup({ inline_keyboard: [] }, { chat_id: chatId, message_id: messageId }); } catch { /* ignore */ }
        await bot.sendMessage(chatId, `✅ Tasdiqlandi! Telefon raqam yuborildi.`);
        await bot.sendMessage(targetUserId,
          `✅ *To'lovingiz tasdiqlandi!*\n\n📞 Mutaxassisimiz bilan bog'laning:\n\n` +
          `🔗 Telefon: *${CONSULTATION_PHONE}*\n` +
          `🕐 Ish vaqti: *${CONSULTATION_HOURS}*\n\n` +
          `Ko'rsatilgan vaqt oralig'ida qo'ng'iroq qiling! ✨`,
          { parse_mode: "Markdown", reply_markup: backToMainKeyboard() }
        );
        resetState(targetUserId);
        return;
      }

      // ── Admin: rad etish  admin_no:<userId> ───────────────────────────
      if (data.startsWith("admin_no:")) {
        const targetUserId = parseInt(data.split(":")[1]!);

        try { await bot.editMessageReplyMarkup({ inline_keyboard: [] }, { chat_id: chatId, message_id: messageId }); } catch { /* ignore */ }
        await bot.sendMessage(chatId, `❌ Rad etildi.`);
        await bot.sendMessage(targetUserId,
          `❌ *To'lovingiz tasdiqlanmadi.*\n\n` +
          `Iltimos, to'g'ri karta raqamiga o'tkazganingizni tekshirib, chekni qayta yuboring.`,
          { parse_mode: "Markdown", reply_markup: backToMainKeyboard() }
        );
        resetState(targetUserId);
        return;
      }
    } catch (err) {
      logger.error({ err, data, userId }, "Callback query handleda xato");
    }
  });

  // ── Rasm/fayl qabul qilish (chek) ─────────────────────────────────────
  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from?.id ?? chatId;
    const username = msg.from?.username
      ? `@${msg.from.username}`
      : (msg.from?.first_name ?? "Noma'lum");

    if (msg.text?.startsWith("/")) return;

    try {

    // ── Admin fayl yuborish / shablon o'rnatish rejimlari ─────────────
    if (userId === ADMIN_ID) {
      const adminState = getAdminState(ADMIN_ID);

      // /settemplate rejimi — fayl qabul qilib saqlash
      if (adminState.step === "setting_template" && adminState.targetCatId) {
        const catId = adminState.targetCatId;
        const cat = CATS.find((c) => c.id === catId);
        if (!msg.document) {
          await bot.sendMessage(chatId, `⚠️ Faqat fayl (hujjat) yuboring. Rasm yoki matn qabul qilinmaydi.\n\nBekor qilish: /bekor`);
          return;
        }
        const fileId = msg.document.file_id;
        const fileName = msg.document.file_name ?? `ariza_${catId}`;
        setTemplate(catId, { fileId, fileName });
        resetAdminState(adminId);
        await bot.sendMessage(chatId,
          `✅ *${cat?.label ?? catId}* shabloni muvaffaqiyatli yangilandi!\n\n` +
          `📎 Fayl: *${fileName}*\n\n` +
          `Endi foydalanuvchilar to'lovdan so'ng asl faylni oladilar.`,
          { parse_mode: "Markdown" }
        );
        logger.info({ catId, fileName }, "Admin shablon fayl yangiladi");
        return;
      }

      if (adminState.step === "sending_ariza" && adminState.targetUserId) {
        const targetUserId = adminState.targetUserId;
        const hasDoc = !!msg.document;
        const hasPhoto = msg.photo && msg.photo.length > 0;
        const hasText = !!msg.text;

        try {
          if (hasDoc) {
            await bot.sendDocument(targetUserId, msg.document!.file_id, {
              caption: `✍️ *Professional ariza tayyor!*\n\nYuristimiz tomonidan yozilgan arizangiz yuborildi. Kerakli joylarni to'ldirib, imzolab sudga topshiring.`,
              parse_mode: "Markdown",
              reply_markup: backToMainKeyboard(),
            });
          } else if (hasPhoto) {
            const fileId = msg.photo![msg.photo!.length - 1]!.file_id;
            await bot.sendPhoto(targetUserId, fileId, {
              caption: `✍️ *Professional ariza tayyor!*\n\nYuristimiz tomonidan yozilgan arizangiz yuborildi.`,
              parse_mode: "Markdown",
              reply_markup: backToMainKeyboard(),
            });
          } else if (hasText) {
            await bot.sendMessage(targetUserId,
              `✍️ *Professional ariza tayyor!*\n\n${msg.text}`,
              { parse_mode: "Markdown", reply_markup: backToMainKeyboard() }
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
    const isWaiting =
      state.step === "waiting_shablon_check" ||
      state.step === "waiting_professional_check" ||
      state.step === "waiting_consultation_check";

    if (!isWaiting) return;

    const hasPhoto = msg.photo && msg.photo.length > 0;
    const hasDoc = !!msg.document;

    if (!hasPhoto && !hasDoc) {
      await bot.sendMessage(chatId,
        `📸 Iltimos, to'lov chekini *rasm yoki fayl* sifatida yuboring.`,
        { parse_mode: "Markdown" }
      );
      return;
    }

    // Admin uchun ma'lumot
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

    const amountText = amount > 0 ? `💰 Summa: *${amount.toLocaleString()} so'm*\n` : `💰 Narxi: *${PROFESSIONAL_PRICE_LABEL}*\n`;
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

      await bot.sendMessage(chatId,
        `⏳ *Chekingiz administratorga yuborildi!*\n\nTasdiqlangach, xizmat darhol yuboriladi. Odatda *5–10 daqiqa* ichida.`,
        { parse_mode: "Markdown" }
      );
      logger.info({ userId, username, step: state.step, serviceId: state.selectedServiceId }, "Chek adminga yuborildi");
    } catch (err) {
      logger.error({ err }, "Adminga chek yuborishda xato");
      await bot.sendMessage(chatId,
        `⚠️ Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.`,
        { reply_markup: backToMainKeyboard() }
      );
    }
  } catch (err) {
    logger.error({ err, userId }, "Message handleda xato");
  }
  });
}

// ── Shablon hujjatlar ──────────────────────────────────────────────────────
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
): Promise<void> {
  const caption = `📄 Bo'sh joylarni yoki sariq bilan belgilangan joylarni o'zingizga moslab to'ldirib, imzolab sudga topshiring.`;

  // 1-ustuvorlik: diskdagi asl Word fayl
  const local = findLocalTemplate(catId);
  if (local) {
    await bot.sendDocument(
      chatId,
      fs.createReadStream(local.filePath),
      { caption, reply_markup: backToMainKeyboard() },
      { filename: local.fileName },
    );
    return;
  }

  // 2-ustuvorlik: admin yuklagan file_id
  const stored = getTemplate(catId);
  if (stored) {
    await bot.sendDocument(chatId, stored.fileId, {
      caption,
      reply_markup: backToMainKeyboard(),
    });
    return;
  }

  // 3-ustuvorlik: PDF cache (fallback)
  const cached = pdfCache.get(catId);
  if (!cached) {
    await bot.sendMessage(chatId, `⚠️ Shablon topilmadi. Iltimos admin bilan bog'laning.`, { reply_markup: backToMainKeyboard() });
    return;
  }

  await bot.sendDocument(
    chatId,
    cached,
    { caption, reply_markup: backToMainKeyboard() },
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
hamda bolalarim bilan ota  uyimga  ketishga  majbur  bo'ldim.  Javobgar  farzandimni
ta'minotini umuman o'ylamaydi. Farzandimning  barcha  xarajatlarini  o'zim  amalga
oshiraman va javobgar tomonidan biror bir moddiy yordam  berilmaydi.  Hattoki  shu
kungacha na meni na farzandimizni holidan xabar oldi.
      Oila Kodeksining 96-moddasiga asosan ota-ona voyaga yetmagan  bolalariga
ta'minot berishi shart.
      Voyaga yetmagan bolalariga ta'minot berish majburiyatini ixtiyoriy  ravishda
bajarrnagan ota (ona)dan sudning hal qiluv qaroriga yoki sud buyrug'iga  asosan
aliment undirilishi belgilangan.
      O'rtamizda aliment to'lash to'g'risida kelishuv mavjud emas.
      Oila Kodeksining 99-moddasiga muvofiq agar  voyaga  yetmagan  bolalariga
ta'minot berish haqida ota-ona o'rtasida kelishuv bo'lmasa,  ularning  ta'minoti
uchun aliment sud tomonidan ota-onaning har oylik ish  haqi  va  (yoki)  boshqa
daromadining bir bola uchun — to'rtdan bir qismi; ikki bola uchun —  uchdan  bir
qismi; uch va undan ortiq bola uchun — yarmi  miqdorida  undirilishi  ko'rsatilib
o'tilgan.
      Yuqoridagilarga asosan:

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
128X3-moddasi 1-qismi bilan huquqbuzarlik sodir etganlikda aybdor deb topildim va ushbu
huquqbuzarlik yuzasidan ______________________________ kuni
______________________________-sonli qaror rasmiylashtirildi.

Ushbu ______________________________-sonli jarima solish to'g'risidagi qarorni
O'zbekiston Respublikasining amaldagi qonunlari buzilgan deb hisoblaymiz. Qaror quyidagi
qonuniy asoslar buzilgan holda rasmiylashtirilgan:

Vazirlar Mahkamasining 2018-yil 1-dekabrdagi 975-sonli qarori Nizomning 6-bobi 1-paragrafi
buzilgan. Ko'chma fotoradarlar, mobil foto va video qayd etish komplekslari orqali aniqlangan
qoidabuzarlik holatlarida to'g'ridan-to'g'ri QAROR emas, faqatgina BAYONNOMA
rasmiylashtiriIishi kerak.

Nizomning 28-bandiga binoan, sertifikatsiyadan o'tmagan, yoki amal qilish muddati o'tgan
texnik vositalardan foydalanish qat'iyan man etiladi. ______________________________-sonli
qarorga hech qanday texnik hujjat ilova qilinmagan.

Nizomning 37-bobi 2-qismiga muvofiq, foto va video fiksatsiyaga asoslangan qarorlar majburiy
ravishda elektron raqamli imzo (ERI) bilan tasdiqlangan bo'lishi shart.
______________________________-sonli qarorda esa hech qanday elektron imzo mavjud emas.

O'zbekiston Respublikasi Ma'muriy javobgarlik to'g'risidagi kodeksining 321-moddasi
2-qismida quyidagicha belgilangan: "Ma'muriy huquqbuzarliklar to'g'risidagi ishlarni yuritish
qoidalarining jiddiy buzilishi — ma'muriy huquqbuzarlik to'g'risidagi ish yuzasidan chiqarilgan
qarorni bekor qilishga asos bo'ladi."

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
