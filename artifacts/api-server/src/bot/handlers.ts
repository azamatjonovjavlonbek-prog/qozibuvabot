import TelegramBot from "node-telegram-bot-api";
import {
  ARIZA_CATEGORIES,
  PROFESSIONAL_TYPES,
  SHABLON_PRICE,
  CONSULTATION_PRICE,
  CONSULTATION_PHONE,
  CONSULTATION_HOURS,
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
  professionalListKeyboard,
  confirmProfessionalKeyboard,
  confirmConsultationKeyboard,
  cancelKeyboard,
  adminApproveKeyboard,
  backToMainKeyboard,
} from "./keyboards";
import { logger } from "../lib/logger";

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

  // ── Admin: /bekor — yuborish rejimini bekor qilish
  bot.onText(/\/bekor/, async (msg) => {
    const chatId = msg.chat.id;
    const adminId = msg.from?.id ?? chatId;
    if (adminId !== ADMIN_ID) return;
    resetAdminState(adminId);
    await bot.sendMessage(chatId, `❌ Yuborish bekor qilindi.`);
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
      `/bekor — yuborish rejimini bekor qilish\n` +
      `/yordam — shu ro'yxat`,
      { parse_mode: "Markdown" }
    );
  });

  bot.on("callback_query", async (query) => {
    const chatId = query.message?.chat.id;
    const messageId = query.message?.message_id;
    const userId = query.from.id;
    const username = query.from.username
      ? `@${query.from.username}`
      : (query.from.first_name ?? "Noma'lum");
    const data = query.data ?? "";

    if (!chatId || !messageId) return;
    await bot.answerCallbackQuery(query.id);

    // ── Bosh menyu ──────────────────────────────────────────────────────
    if (data === "back_main") {
      resetState(userId);
      await bot.editMessageText(
        `🏠 *Bosh menyu*\n\nQuyidagi xizmatlardan birini tanlang:`,
        { chat_id: chatId, message_id: messageId, parse_mode: "Markdown", reply_markup: mainMenuKeyboard() }
      );
      return;
    }

    // ── Ariza bo'limi ────────────────────────────────────────────────────
    if (data === "menu_ariza") {
      setState(userId, { step: "idle" });
      await bot.editMessageText(
        `📄 *Ariza bo'limi*\n\nQuyidagi ikki xizmatdan birini tanlang:\n\n` +
        `📝 *Shablon ariza* — tayyor shablon, ba'zi ma'lumotlarni o'zingiz to'ldirasiz.\n` +
        `✍️ *Professional ariza* — yurist tomonidan to'liq yozib beriladi.`,
        { chat_id: chatId, message_id: messageId, parse_mode: "Markdown", reply_markup: arizaMenuKeyboard() }
      );
      return;
    }

    // ── Shablon ariza ro'yxati ───────────────────────────────────────────
    if (data === "menu_shablon") {
      setState(userId, { step: "selecting_shablon" });
      await bot.editMessageText(
        `📝 *Shablon ariza*\n\nNarxi: *${SHABLON_PRICE.toLocaleString()} so'm*\n\nTayyor shablon faylingiz yuboriladi. Undagi bo'sh joylarni o'zingiz to'ldirасiz.\n\nQaysi mavzu bo'yicha ariza kerak?`,
        { chat_id: chatId, message_id: messageId, parse_mode: "Markdown", reply_markup: shablonListKeyboard() }
      );
      return;
    }

    if (data.startsWith("shablon_")) {
      const catId = data.replace("shablon_", "");
      const cat = ARIZA_CATEGORIES.find((c) => c.id === catId);
      if (!cat) return;

      setState(userId, { step: "confirming_shablon", selectedServiceId: catId });
      await bot.editMessageText(
        `📝 *${cat.label} — Shablon ariza*\n\n` +
        `Tayyor shablon faylini olasiz va undagi bo'sh joylarni o'zingiz to'ldirasiz.\n\n` +
        `💰 Narxi: *${SHABLON_PRICE.toLocaleString()} so'm*`,
        { chat_id: chatId, message_id: messageId, parse_mode: "Markdown", reply_markup: confirmShablonKeyboard(catId) }
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
      await bot.editMessageText(
        `💳 *To'lov ma'lumotlari*\n\n` +
        `Xizmat: *${cat.label} (Shablon)*\n` +
        `Summa: *${SHABLON_PRICE.toLocaleString()} so'm*\n\n` +
        `🏦 Karta raqami:\n\`${CARD_NUMBER}\`\n` +
        `👤 Karta egasi: *${CARD_OWNER}*\n\n` +
        `✅ To'lov qilgandan so'ng *to'lov cheki (screenshot) rasmini* shu chatga yuboring.`,
        { chat_id: chatId, message_id: messageId, parse_mode: "Markdown", reply_markup: cancelKeyboard() }
      );
      return;
    }

    // ── Professional ariza ro'yxati ──────────────────────────────────────
    if (data === "menu_professional") {
      setState(userId, { step: "selecting_professional" });
      await bot.editMessageText(
        `✍️ *Professional ariza*\n\nYuristimiz sizning holatингизга mos ariza yozib beradi.\n\n` +
        `💰 Narxi: *199 000 – 399 000 so'm* (mavzuga qarab)\n\n` +
        `Qaysi mavzu bo'yicha ariza kerak?`,
        { chat_id: chatId, message_id: messageId, parse_mode: "Markdown", reply_markup: professionalListKeyboard() }
      );
      return;
    }

    if (data.startsWith("pro_")) {
      const proId = data.replace("pro_", "");
      const pro = PROFESSIONAL_TYPES.find((p) => p.id === proId);
      if (!pro) return;

      setState(userId, { step: "confirming_professional", selectedServiceId: proId });
      await bot.editMessageText(
        `✍️ *${pro.label} — Professional ariza*\n\n` +
        `Yuristimiz sizning holatIngizni o'rganib, sudga tayyor ariza matnini yozib beradi.\n\n` +
        `💰 Narxi: *${pro.price.toLocaleString()} so'm*\n\n` +
        `📌 To'lovdan so'ng yuristimiz siz bilan bog'lanib, kerakli ma'lumotlarni so'raydi va tayyor arizani bot orqali yuboradi.`,
        { chat_id: chatId, message_id: messageId, parse_mode: "Markdown", reply_markup: confirmProfessionalKeyboard(proId, pro.price) }
      );
      return;
    }

    if (data.startsWith("pay_pro_")) {
      const proId = data.replace("pay_pro_", "");
      const pro = PROFESSIONAL_TYPES.find((p) => p.id === proId);
      if (!pro) return;

      setState(userId, {
        step: "waiting_professional_check",
        selectedServiceId: proId,
        pendingChatId: chatId,
        pendingUsername: username,
        pendingType: "professional",
      });
      await bot.editMessageText(
        `💳 *To'lov ma'lumotlari*\n\n` +
        `Xizmat: *${pro.label} (Professional)*\n` +
        `Summa: *${pro.price.toLocaleString()} so'm*\n\n` +
        `🏦 Karta raqami:\n\`${CARD_NUMBER}\`\n` +
        `👤 Karta egasi: *${CARD_OWNER}*\n\n` +
        `✅ To'lov qilgandan so'ng *to'lov cheki (screenshot) rasmini* shu chatga yuboring.`,
        { chat_id: chatId, message_id: messageId, parse_mode: "Markdown", reply_markup: cancelKeyboard() }
      );
      return;
    }

    // ── Konsultatsiya ────────────────────────────────────────────────────
    if (data === "menu_consultation") {
      setState(userId, { step: "selecting_consultation" });
      await bot.editMessageText(
        `📞 *Konsultatsiya xizmati*\n\nHuquqiy masalalaringiz bo'yicha mutaxassisimiz bilan bog'laning.\n\n` +
        `💰 Narxi: *${CONSULTATION_PRICE.toLocaleString()} so'm*\n` +
        `🕐 Ish vaqti: *${CONSULTATION_HOURS}*\n\n` +
        `To'lovdan so'ng telefon raqamimiz yuboriladi.`,
        { chat_id: chatId, message_id: messageId, parse_mode: "Markdown", reply_markup: confirmConsultationKeyboard() }
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
      await bot.editMessageText(
        `💳 *To'lov ma'lumotlari*\n\n` +
        `Xizmat: *Konsultatsiya*\n` +
        `Summa: *${CONSULTATION_PRICE.toLocaleString()} so'm*\n\n` +
        `🏦 Karta raqami:\n\`${CARD_NUMBER}\`\n` +
        `👤 Karta egasi: *${CARD_OWNER}*\n\n` +
        `✅ To'lov qilgandan so'ng *to'lov cheki (screenshot) rasmini* shu chatga yuboring.`,
        { chat_id: chatId, message_id: messageId, parse_mode: "Markdown", reply_markup: cancelKeyboard() }
      );
      return;
    }

    // ── Admin: shablon tasdiqlash  admin_ok_s:<userId>:<catId> ──────────
    if (data.startsWith("admin_ok_s:")) {
      const parts = data.split(":");
      const targetUserId = parseInt(parts[1]!);
      const catId = parts[2]!;
      const cat = ARIZA_CATEGORIES.find((c) => c.id === catId);

      await bot.editMessageReplyMarkup({ inline_keyboard: [] }, { chat_id: chatId, message_id: messageId });

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

    // ── Admin: professional tasdiqlash  admin_ok_p:<userId>:<proId> ─────
    if (data.startsWith("admin_ok_p:")) {
      const parts = data.split(":");
      const targetUserId = parseInt(parts[1]!);
      const proId = parts[2]!;
      const pro = PROFESSIONAL_TYPES.find((p) => p.id === proId);

      await bot.editMessageReplyMarkup({ inline_keyboard: [] }, { chat_id: chatId, message_id: messageId });

      if (!pro) {
        await bot.sendMessage(chatId, `⚠️ Xizmat turi topilmadi: ${proId}`);
        return;
      }

      await bot.sendMessage(chatId,
        `✅ Tasdiqlandi!\n\n📌 Endi foydalanuvchi (ID: \`${targetUserId}\`) bilan bog'laning va ariza uchun kerakli ma'lumotlarni so'rang.`,
        { parse_mode: "Markdown" }
      );
      await bot.sendMessage(targetUserId,
        `✅ *To'lovingiz tasdiqlandi!*\n\n✍️ *${pro.label}* bo'yicha professional ariza buyurtmangiz qabul qilindi.\n\n` +
        `Yuristimiz tez orada siz bilan bog'lanib, kerakli ma'lumotlarni so'raydi. Iltimos, kutib turing.`,
        { parse_mode: "Markdown", reply_markup: backToMainKeyboard() }
      );
      resetState(targetUserId);
      return;
    }

    // ── Admin: konsultatsiya tasdiqlash  admin_ok_c:<userId> ────────────
    if (data.startsWith("admin_ok_c:")) {
      const targetUserId = parseInt(data.split(":")[1]!);

      await bot.editMessageReplyMarkup({ inline_keyboard: [] }, { chat_id: chatId, message_id: messageId });
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

    // ── Admin: rad etish  admin_no:<userId> ─────────────────────────────
    if (data.startsWith("admin_no:")) {
      const targetUserId = parseInt(data.split(":")[1]!);

      await bot.editMessageReplyMarkup({ inline_keyboard: [] }, { chat_id: chatId, message_id: messageId });
      await bot.sendMessage(chatId, `❌ Rad etildi.`);
      await bot.sendMessage(targetUserId,
        `❌ *To'lovingiz tasdiqlanmadi.*\n\n` +
        `Iltimos, to'g'ri karta raqamiga o'tkazganingizni tekshirib, chekni qayta yuboring.`,
        { parse_mode: "Markdown", reply_markup: backToMainKeyboard() }
      );
      resetState(targetUserId);
      return;
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

    // ── Admin fayl yuborish rejimi ─────────────────────────────────────
    if (userId === ADMIN_ID) {
      const adminState = getAdminState(ADMIN_ID);
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
      const pro = PROFESSIONAL_TYPES.find((p) => p.id === state.selectedServiceId);
      serviceLabel = `✍️ Professional: *${pro?.label ?? state.selectedServiceId}*`;
      amount = pro?.price ?? 0;
      adminKeyboard = adminApproveKeyboard(userId, "professional", state.selectedServiceId);
    } else {
      serviceLabel = `📞 Konsultatsiya`;
      amount = CONSULTATION_PRICE;
      adminKeyboard = adminApproveKeyboard(userId, "consultation");
    }

    const adminText =
      `🔔 *Yangi to'lov cheki!*\n\n` +
      `👤 Foydalanuvchi: ${username}\n` +
      `🆔 ID: \`${userId}\`\n` +
      `${serviceLabel}\n` +
      `💰 Summa: *${amount.toLocaleString()} so'm*\n\n` +
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
  });
}

// ── Shablon hujjatlar ──────────────────────────────────────────────────────
async function sendShablonDocument(
  bot: TelegramBot,
  chatId: number,
  catId: string,
): Promise<void> {
  const templates: Record<string, string> = {
    divorce: generateDivorceTemplate(),
    aliment: generateAlimentTemplate(),
    property: generatePropertyTemplate(),
    child_custody: generateChildCustodyTemplate(),
    debt: generateDebtTemplate(),
    labor: generateLaborTemplate(),
    other: generateOtherTemplate(),
  };

  const content = templates[catId] ?? templates["other"]!;
  const buffer = Buffer.from(content, "utf-8");

  await bot.sendDocument(
    chatId,
    buffer,
    {
      caption: "📄 Bo'sh joylarni to'ldirib, imzolab sudga topshiring.",
      reply_markup: backToMainKeyboard(),
    },
    { filename: `shablon_ariza_${catId}.txt`, contentType: "text/plain" }
  );
}

function generateDivorceTemplate(): string {
  return `NIKOHNI BEKOR QILISH TO'G'RISIDA
ARIZA (DA'VO ARIZASI)

____________ TUMANI (SHAHRI) FUQAROLIK ISHLARI BO'YICHA
____________ SUDIGA

Da'vogar: ___________________________
          (F.I.O.)
Manzil: _____________________________
Telefon: ____________________________

Javobgar: ___________________________
          (F.I.O.)
Manzil: _____________________________

ARIZA

Men, _____________________ (F.I.O.), _____________________ (F.I.O.) bilan
_____ yil _____ oyda nikoh bog'laganman.
Nikoh ____ raqami bilan ro'yxatdan o'tgan.

Nikoh davomida _____ nafar farzand(lar) tug'ilgan:
1. _____________________________ (tug'ilgan yil: _____)
2. _____________________________ (tug'ilgan yil: _____)

Nikohni davom ettirish imkoniyati qolmaganligi sababli, ya'ni:
_______________________________________________

O'TINAMAN:

1. Men bilan javobgar o'rtasidagi nikohni bekor qilishni.
2. Farzand(lar)ni mening tarbiyamga berishni.
3. Birgalikda orttirgan mulkni quyidagicha bo'lishni:
   _______________________________________________

ILOVA:
- Nikoh guvohnomasi nusxasi
- Farzandlar tug'ilganlik guvohnomasi nusxasi
- Davlat boji to'lovi cheki

Sana: _____ yil _____ oy _____ kun
Imzo: _____________ / _____________________ /`;
}

function generateAlimentTemplate(): string {
  return `ALIMENT UNDIRISH TO'G'RISIDA
ARIZA (DA'VO ARIZASI)

____________ TUMANI (SHAHRI) FUQAROLIK ISHLARI BO'YICHA
____________ SUDIGA

Da'vogar: ___________________________
Manzil: _____________________________
Telefon: ____________________________

Javobgar: ___________________________
Ish joyi: ___________________________

ARIZA

Men, _____________________, javobgar _____________________ bilan
_____ yildan _____ yilgacha nikohda bo'lganman.

Farzand(lar):
1. _____________________________ (tug'ilgan: _____)
2. _____________________________ (tug'ilgan: _____)

Javobgar farzand(lar) boqishiga hech qanday hissa qo'shmayapti.

O'TINAMAN:

Javobgardan aliment undirishni:
- 1 nafar: 1/4 (25%) | 2 nafar: 1/3 (33%) | 3+: 1/2 (50%)

ILOVA:
- Nikoh/ajralish guvohnomasi nusxasi
- Farzandlar tug'ilganlik guvohnomasi nusxasi
- Davlat boji to'lovi cheki

Sana: _____ yil _____ oy _____ kun
Imzo: _____________ / _____________________ /`;
}

function generatePropertyTemplate(): string {
  return `BIRGALIKDA ORTTIRGAN MULKNI BO'LISH TO'G'RISIDA
ARIZA (DA'VO ARIZASI)

____________ TUMANI (SHAHRI) FUQAROLIK ISHLARI BO'YICHA
____________ SUDIGA

Da'vogar: ___________________________
Javobgar: ___________________________

ARIZA

Nikoh davomida ortirilgan mulk:

1. Ko'chmas mulk: _____________________________
   Bahosi: _____________________________ so'm

2. Avtomobil: ________________________________
   Bahosi: _____________________________ so'm

3. Boshqa: ___________________________________

Jami: __________________ so'm

O'TINAMAN: Mulkni teng (50/50) bo'lishni.

ILOVA: Mulk hujjatlari, nikoh/ajralish guvohnomasi, davlat boji cheki.

Sana: _____ yil _____ oy _____ kun
Imzo: _____________ / _____________________ /`;
}

function generateChildCustodyTemplate(): string {
  return `FARZANDNI VASIYLIKKA OLISH TO'G'RISIDA
ARIZA (DA'VO ARIZASI)

____________ TUMANI (SHAHRI) FUQAROLIK ISHLARI BO'YICHA
____________ SUDIGA

Da'vogar: ___________________________
Javobgar: ___________________________

ARIZA

Farzand: _____________________________ (tug'ilgan: _____)
Hozir: _________________________ tarbiyasida.

Farzandni mening tarbiyamga berishga asoslar:
1. _______________________________________________
2. _______________________________________________

O'TINAMAN: Farzandni mening tarbiyamga berishni.

ILOVA: Tug'ilganlik guvohnomasi, ajralish guvohnomasi, turar joy va ish hujjatlari.

Sana: _____ yil _____ oy _____ kun
Imzo: _____________ / _____________________ /`;
}

function generateDebtTemplate(): string {
  return `QARZ UNDIRISH TO'G'RISIDA
ARIZA (DA'VO ARIZASI)

____________ TUMANI (SHAHRI) FUQAROLIK ISHLARI BO'YICHA
____________ SUDIGA

Da'vogar: ___________________________
Javobgar: ___________________________

ARIZA

_____ yil _____ oyda javobgarga _____________________ so'm qarz berdim.
Qaytarish muddati: _____________________
Hujjat: _____________________

Qarz qaytarilmadi.

O'TINAMAN:
1. Asosiy qarz: __________________ so'm.
2. Kechikish foizi: ______________ so'm.
3. Sud xarajatlarini undirishni.

ILOVA: Qarz hujjati, o'tkazma tasdiqlari, davlat boji cheki.

Sana: _____ yil _____ oy _____ kun
Imzo: _____________ / _____________________ /`;
}

function generateLaborTemplate(): string {
  return `MEHNAT HUQUQLARINI TIKLASH TO'G'RISIDA
ARIZA (DA'VO ARIZASI)

____________ TUMANI (SHAHRI) FUQAROLIK ISHLARI BO'YICHA
____________ SUDIGA

Da'vogar: ___________________________
Javobgar (Ish beruvchi): ______________

ARIZA

_____ yildan beri _____________________ lavozimida ishladim.

Muammo: _______________________________________________
(Noto'g'ri ishdan bo'shatish / Ish haqi to'lanmagan / Boshqa)

Voqea sanasi: _____________________

O'TINAMAN:
1. Ishga qayta tiklashni / To'lanmagan ish haqi: ________ so'm.
2. Moddiy zarar: ______________ so'm.
3. Sud xarajatlarini undirishni.

ILOVA: Mehnat shartnomasi, ishdan bo'shatish buyrug'i, ish haqi hujjatlari.

Sana: _____ yil _____ oy _____ kun
Imzo: _____________ / _____________________ /`;
}

function generateOtherTemplate(): string {
  return `DA'VO ARIZASI

____________ TUMANI (SHAHRI) FUQAROLIK ISHLARI BO'YICHA
____________ SUDIGA

Da'vogar: ___________________________
Javobgar: ___________________________

ARIZA

Nizo mohiyati:
_______________________________________________
_______________________________________________

Voqealar:
_____ yil _____ oy: ______________________________

Huquqiy asos: O'zbekiston Respublikasi ________ Kodeksining ___-moddasi.

O'TINAMAN:
1. _______________________________________________
2. Sud xarajatlarini undirishni.

ILOVA: Dalil hujjatlari, davlat boji cheki.

Sana: _____ yil _____ oy _____ kun
Imzo: _____________ / _____________________ /`;
}
