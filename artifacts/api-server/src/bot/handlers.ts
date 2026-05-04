import TelegramBot from "node-telegram-bot-api";
import {
  ARIZA_TYPES,
  CONSULTATION_PRICE,
  ARIZA_PRICE,
  CONSULTATION_PHONE,
  CONSULTATION_HOURS,
  CARD_NUMBER,
  CARD_OWNER,
  ADMIN_ID,
} from "./config";
import { getState, setState, resetState } from "./state";
import {
  mainMenuKeyboard,
  arizaListKeyboard,
  confirmArizaKeyboard,
  confirmConsultationKeyboard,
  checkSentKeyboard,
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

  bot.on("callback_query", async (query) => {
    const chatId = query.message?.chat.id;
    const messageId = query.message?.message_id;
    const userId = query.from.id;
    const username = query.from.username ? `@${query.from.username}` : query.from.first_name;
    const data = query.data ?? "";

    if (!chatId || !messageId) return;

    await bot.answerCallbackQuery(query.id);

    if (data === "back_main") {
      resetState(userId);
      await bot.editMessageText(
        `🏠 *Bosh menyu*\n\nQuyidagi xizmatlardan birini tanlang:`,
        { chat_id: chatId, message_id: messageId, parse_mode: "Markdown", reply_markup: mainMenuKeyboard() }
      );
      return;
    }

    if (data === "menu_ariza") {
      setState(userId, { step: "selecting_ariza" });
      await bot.editMessageText(
        `📄 *Ariza turini tanlang*\n\nHar bir ariza narxi: *${ARIZA_PRICE.toLocaleString()} so'm*\nTo'lovdan so'ng ariza fayli avtomatik yuboriladi.`,
        { chat_id: chatId, message_id: messageId, parse_mode: "Markdown", reply_markup: arizaListKeyboard() }
      );
      return;
    }

    if (data === "menu_consultation") {
      setState(userId, { step: "selecting_consultation" });
      await bot.editMessageText(
        `📞 *Konsultatsiya xizmati*\n\nHuquqiy masalalaringiz bo'yicha mutaxassisimiz bilan bog'laning.\n\n💰 Narxi: *${CONSULTATION_PRICE.toLocaleString()} so'm*\n🕐 Ish vaqti: *${CONSULTATION_HOURS}*\n\nTo'lovdan so'ng telefon raqamimiz yuboriladi.`,
        { chat_id: chatId, message_id: messageId, parse_mode: "Markdown", reply_markup: confirmConsultationKeyboard() }
      );
      return;
    }

    if (data.startsWith("ariza_")) {
      const arizaId = data.replace("ariza_", "");
      const ariza = ARIZA_TYPES.find((a) => a.id === arizaId);
      if (!ariza) return;

      setState(userId, { step: "confirming_ariza", selectedArizaId: arizaId });
      await bot.editMessageText(
        `📋 *${ariza.label}*\n\n${ariza.description}\n\n💰 Narxi: *${ariza.price.toLocaleString()} so'm*\n\nTo'lov qilishni tasdiqlaysizmi?`,
        { chat_id: chatId, message_id: messageId, parse_mode: "Markdown", reply_markup: confirmArizaKeyboard(arizaId) }
      );
      return;
    }

    if (data.startsWith("pay_ariza_")) {
      const arizaId = data.replace("pay_ariza_", "");
      const ariza = ARIZA_TYPES.find((a) => a.id === arizaId);
      if (!ariza) return;

      setState(userId, {
        step: "waiting_ariza_check",
        selectedArizaId: arizaId,
        pendingChatId: chatId,
        pendingUserId: userId,
        pendingUsername: username,
        pendingType: "ariza",
      });

      await bot.editMessageText(
        `💳 *To'lov ma'lumotlari*\n\n` +
        `Quyidagi kartaga *${ariza.price.toLocaleString()} so'm* o'tkazing:\n\n` +
        `🏦 Karta raqami:\n\`${CARD_NUMBER}\`\n` +
        `👤 Karta egasi: *${CARD_OWNER}*\n\n` +
        `To'lovni amalga oshirgach, chek (screenshot) yuboring va "✅ Chek yubordim" tugmasini bosing.`,
        { chat_id: chatId, message_id: messageId, parse_mode: "Markdown", reply_markup: checkSentKeyboard() }
      );
      return;
    }

    if (data === "pay_consultation") {
      setState(userId, {
        step: "waiting_consultation_check",
        pendingChatId: chatId,
        pendingUserId: userId,
        pendingUsername: username,
        pendingType: "consultation",
      });

      await bot.editMessageText(
        `💳 *To'lov ma'lumotlari*\n\n` +
        `Quyidagi kartaga *${CONSULTATION_PRICE.toLocaleString()} so'm* o'tkazing:\n\n` +
        `🏦 Karta raqami:\n\`${CARD_NUMBER}\`\n` +
        `👤 Karta egasi: *${CARD_OWNER}*\n\n` +
        `To'lovni amalga oshirgach, chek (screenshot) yuboring va "✅ Chek yubordim" tugmasini bosing.`,
        { chat_id: chatId, message_id: messageId, parse_mode: "Markdown", reply_markup: checkSentKeyboard() }
      );
      return;
    }

    if (data === "check_sent") {
      const state = getState(userId);
      if (
        state.step !== "waiting_ariza_check" &&
        state.step !== "waiting_consultation_check"
      ) return;

      await bot.editMessageText(
        `⏳ *Chekingiz tekshirilmoqda...*\n\nAdministrator tomonidan tasdiqlanishi bilanoq sizga xizmat yuboriladi. Odatda 5-10 daqiqa ichida.`,
        { chat_id: chatId, message_id: messageId, parse_mode: "Markdown" }
      );
      return;
    }

    if (data.startsWith("admin_approve_ariza_")) {
      const parts = data.replace("admin_approve_ariza_", "").split("_");
      const targetUserId = parseInt(parts[0]!);
      const arizaId = parts[1]!;
      const ariza = ARIZA_TYPES.find((a) => a.id === arizaId);
      const state = getState(targetUserId);

      if (!ariza) return;

      await bot.editMessageReplyMarkup({ inline_keyboard: [] }, { chat_id: chatId, message_id: messageId });
      await bot.sendMessage(chatId, `✅ Tasdiqlandi! Ariza foydalanuvchiga yuborildi.`);

      const targetChatId = state.pendingChatId ?? targetUserId;
      await bot.sendMessage(
        targetChatId,
        `✅ *To'lovingiz tasdiqlandi!*\n\n📄 *${ariza.label}* fayli quyida yuborilmoqda...`,
        { parse_mode: "Markdown" }
      );
      await sendArizaDocument(bot, targetChatId, arizaId);
      resetState(targetUserId);
      return;
    }

    if (data.startsWith("admin_approve_consultation_")) {
      const targetUserId = parseInt(data.replace("admin_approve_consultation_", ""));
      const state = getState(targetUserId);

      await bot.editMessageReplyMarkup({ inline_keyboard: [] }, { chat_id: chatId, message_id: messageId });
      await bot.sendMessage(chatId, `✅ Tasdiqlandi! Telefon raqam foydalanuvchiga yuborildi.`);

      const targetChatId = state.pendingChatId ?? targetUserId;
      await bot.sendMessage(
        targetChatId,
        `✅ *To'lovingiz tasdiqlandi!*\n\n📞 Mutaxassisimiz bilan bog'laning:\n\n🔗 Telefon: *${CONSULTATION_PHONE}*\n🕐 Ish vaqti: *${CONSULTATION_HOURS}*\n\nKo'rsatilgan vaqt oralig'ida qo'ng'iroq qilishingiz mumkin! ✨`,
        { parse_mode: "Markdown", reply_markup: backToMainKeyboard() }
      );
      resetState(targetUserId);
      return;
    }

    if (data.startsWith("admin_reject_")) {
      const targetUserId = parseInt(data.replace("admin_reject_", ""));
      const state = getState(targetUserId);

      await bot.editMessageReplyMarkup({ inline_keyboard: [] }, { chat_id: chatId, message_id: messageId });
      await bot.sendMessage(chatId, `❌ Rad etildi. Foydalanuvchiga xabar yuborildi.`);

      const targetChatId = state.pendingChatId ?? targetUserId;
      await bot.sendMessage(
        targetChatId,
        `❌ *To'lovingiz tasdiqlanmadi.*\n\nIltimos, to'g'ri karta raqamiga o'tkazganingizni tekshirib, chekni qayta yuboring yoki biz bilan bog'laning.`,
        { parse_mode: "Markdown", reply_markup: backToMainKeyboard() }
      );
      resetState(targetUserId);
      return;
    }
  });

  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from?.id ?? chatId;
    const username = msg.from?.username ? `@${msg.from.username}` : msg.from?.first_name ?? "Noma'lum";
    const state = getState(userId);

    if (msg.text?.startsWith("/")) return;

    if (
      state.step === "waiting_ariza_check" ||
      state.step === "waiting_consultation_check"
    ) {
      const hasPhoto = msg.photo && msg.photo.length > 0;
      const hasDoc = !!msg.document;

      if (!hasPhoto && !hasDoc) {
        await bot.sendMessage(
          chatId,
          `📸 Iltimos, to'lov chekini *rasm* yoki *fayl* sifatida yuboring.`,
          { parse_mode: "Markdown" }
        );
        return;
      }

      const isAriza = state.step === "waiting_ariza_check";
      const ariza = isAriza
        ? ARIZA_TYPES.find((a) => a.id === state.selectedArizaId)
        : null;

      const serviceLabel = isAriza
        ? `📄 Ariza: *${ariza?.label ?? "Noma'lum"}*`
        : `📞 Konsultatsiya`;

      const amount = isAriza ? ARIZA_PRICE : CONSULTATION_PRICE;

      const approveData = isAriza
        ? `admin_approve_ariza_${userId}_${state.selectedArizaId}`
        : `admin_approve_consultation_${userId}`;

      const adminText =
        `🔔 *Yangi to'lov cheki keldi!*\n\n` +
        `👤 Foydalanuvchi: ${username}\n` +
        `🆔 ID: \`${userId}\`\n` +
        `${serviceLabel}\n` +
        `💰 Summa: *${amount.toLocaleString()} so'm*\n\n` +
        `Chekni tekshirib tasdiqlang yoki rad eting:`;

      const adminKeyboard = adminApproveKeyboard(userId, isAriza ? "ariza" : "consultation", state.selectedArizaId);

      try {
        if (hasPhoto) {
          const fileId = msg.photo![msg.photo!.length - 1]!.file_id;
          await bot.sendPhoto(ADMIN_ID, fileId, {
            caption: adminText,
            parse_mode: "Markdown",
            reply_markup: adminKeyboard,
          });
        } else if (hasDoc) {
          await bot.sendDocument(ADMIN_ID, msg.document!.file_id, {
            caption: adminText,
            parse_mode: "Markdown",
            reply_markup: adminKeyboard,
          });
        }

        await bot.sendMessage(
          chatId,
          `⏳ *Chekingiz administratorga yuborildi!*\n\nTasdiqlangach, xizmat darhol yuboriladi. Odatda 5-10 daqiqa ichida.`,
          { parse_mode: "Markdown" }
        );
      } catch (err) {
        logger.error({ err }, "Admin ga xabar yuborishda xato");
        await bot.sendMessage(
          chatId,
          `⚠️ Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.`,
          { reply_markup: backToMainKeyboard() }
        );
      }
    }
  });
}

async function sendArizaDocument(bot: TelegramBot, chatId: number, arizaId: string): Promise<void> {
  const templates: Record<string, string> = {
    divorce: generateDivorceTemplate(),
    aliment: generateAlimentTemplate(),
    property: generatePropertyTemplate(),
    child_custody: generateChildCustodyTemplate(),
    debt: generateDebtTemplate(),
    labor: generateLaborTemplate(),
    other: generateOtherTemplate(),
  };

  const content = templates[arizaId] ?? templates["other"]!;
  const buffer = Buffer.from(content, "utf-8");

  await bot.sendDocument(
    chatId,
    buffer,
    { caption: "📄 Ushbu arizani to'ldirib, imzolab sudga topshiring.", reply_markup: backToMainKeyboard() },
    { filename: `ariza_${arizaId}.txt`, contentType: "text/plain" }
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
          (F.I.O.)
Manzil: _____________________________
Telefon: ____________________________

Javobgar: ___________________________
          (F.I.O.)
Manzil: _____________________________
Ish joyi: ___________________________

ARIZA

Men, _____________________ (F.I.O.), javobgar _____________________ bilan
_____ yildan _____ yilgacha nikohda bo'lganman.

Nikohimizdan quyidagi farzand(lar) tug'ilgan:
1. _____________________________ (tug'ilgan: _____)
2. _____________________________ (tug'ilgan: _____)

Farzand(lar) hozirda mening tarbiyamda bo'lib, javobgar ularning boqishiga
hech qanday moddiy hissa qo'shmayapti.

O'zbekiston Respublikasi Oila kodeksining 99-moddasi asosida:

O'TINAMAN:

Javobgardan har oylik daromadining quyidagi ulushini aliment sifatida undirishni:
- 1 nafar farzand uchun: 1/4 (25%)
- 2 nafar farzand uchun: 1/3 (33%)
- 3 va undan ortiq: 1/2 (50%)

Farzandlar: _____ nafar — daromadining _____ ulushini

ILOVA:
- Nikoh (ajralish) guvohnomasi nusxasi
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
Manzil: _____________________________
Telefon: ____________________________

Javobgar: ___________________________
Manzil: _____________________________

ARIZA

Men, _____________________, javobgar _____________________ bilan
_____ yildan _____ yilgacha nikohda bo'lganman.
Nikoh _____ yil _____ oyda bekor qilingan.

Nikoh davomida quyidagi mulk ortirilgan:

1. Ko'chmas mulk:
   Manzil: _____________________________
   Bahosi: _____________________________ so'm

2. Avtomobil:
   Markasi/modeli: _____________________
   Davlat raqami: ______________________
   Bahosi: _____________________________ so'm

3. Boshqa mol-mulk:
   _______________________________________________

Jami mulk qiymati taxminan: __________________ so'm

O'TINAMAN:

Yuqorida ko'rsatilgan mulkni teng (50/50) yoki quyidagi nisbatda bo'lishni:
_______________________________________________

ILOVA:
- Mulk hujjatlari nusxasi
- Bahosi bo'yicha ekspert xulosasi (mavjud bo'lsa)
- Nikoh/ajralish guvohnomasi nusxasi

Sana: _____ yil _____ oy _____ kun

Imzo: _____________ / _____________________ /`;
}

function generateChildCustodyTemplate(): string {
  return `FARZANDNI VASIYLIKKA OLISH TO'G'RISIDA
ARIZA (DA'VO ARIZASI)

____________ TUMANI (SHAHRI) FUQAROLIK ISHLARI BO'YICHA
____________ SUDIGA

Da'vogar: ___________________________
Manzil: _____________________________
Telefon: ____________________________

Javobgar: ___________________________
Manzil: _____________________________

ARIZA

Men, _____________________, javobgar _____________________ bilan
nikohdan ajrashganman (ajralish guvohnomasi № _____).

Farzandimiz: _____________________________
Tug'ilgan sana: __________________________

Farzandimiz hozirda _____________________ (kim) tarbiyasida.

Farzandning _____ mening tarbiyamda bo'lishi uchun quyidagi asoslar mavjud:
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

Moddiy sharoitim: _______________________________________________
Turar joyim: ___________________________________________________

O'TINAMAN:

Farzand _____________________________ (F.I.O.) ni
mening — _____________________________ (F.I.O.) — tarbiyamga berishni.

ILOVA:
- Farzand tug'ilganlik guvohnomasi
- Ajralish guvohnomasi
- Turar joy hujjatlari
- Ish joyi ma'lumotnomasi

Sana: _____ yil _____ oy _____ kun

Imzo: _____________ / _____________________ /`;
}

function generateDebtTemplate(): string {
  return `QARZ UNDIRISH TO'G'RISIDA
ARIZA (DA'VO ARIZASI)

____________ TUMANI (SHAHRI) FUQAROLIK ISHLARI BO'YICHA
____________ SUDIGA

Da'vogar: ___________________________
Manzil: _____________________________
Telefon: ____________________________

Javobgar: ___________________________
Manzil: _____________________________

ARIZA

Men, _____________________, _____ yil _____ oyda javobgar _____________________
ga _____________________ so'm miqdorida pul qarz berdim.

Qarz berish holati: _______________________________________________
Qaytarish muddati: _______________________________________________
Hujjatlar (kvitansiya/shartnoma): __________________________________

Qarz o'z vaqtida qaytarilmadi. Bir necha bor murojaat qildim, ammo natija bo'lmadi.

O'TINAMAN:

1. Javobgardan asosiy qarz: __________________ so'mni undirishni.
2. Kechikish uchun foiz/jarimani: ____________ so'mni undirishni.
3. Sud xarajatlarini javobgardan undirishni.

ILOVA:
- Qarz hujjati (tilxat/shartnoma) nusxasi
- Pul o'tkazma tasdiqlari
- Javobgarga murojaat qilganligi haqida dalillar
- Davlat boji to'lovi cheki

Sana: _____ yil _____ oy _____ kun

Imzo: _____________ / _____________________ /`;
}

function generateLaborTemplate(): string {
  return `MEHNAT HUQUQLARINI TIKLASH TO'G'RISIDA
ARIZA (DA'VO ARIZASI)

____________ TUMANI (SHAHRI) FUQAROLIK ISHLARI BO'YICHA
____________ SUDIGA

Da'vogar: ___________________________
Manzil: _____________________________
Telefon: ____________________________

Javobgar (Ish beruvchi): ______________
Yuridik manzil: ______________________

ARIZA

Men, _____________________, _____ yildan beri javobgar tashkilotda
_____________________ lavozimida ishladim.

Muammo: _______________________________________________
(Noto'g'ri ishdan bo'shatish / Ish haqi to'lanmagan / Boshqa)

Voqea sanasi: _______________________________________________
Ish beruvchining harakati: _______________________________________
Bu harakat qonunga zidligi: ______________________________________

O'TINAMAN:

1. Meni ishga qayta tiklashni (yoki)
2. To'lanmagan ish haqini _________________ so'm miqdorida undirishni.
3. Moddiy zarar _________________ so'mni undirishni.
4. Ma'naviy zarar _________________ so'mni undirishni.
5. Sud xarajatlarini javobgardan undirishni.

ILOVA:
- Mehnat shartnomasi nusxasi
- Ishdan bo'shatish buyrug'i nusxasi (mavjud bo'lsa)
- Ish haqi to'lovi hujjatlari
- Davlat boji to'lovi cheki

Sana: _____ yil _____ oy _____ kun

Imzo: _____________ / _____________________ /`;
}

function generateOtherTemplate(): string {
  return `DA'VO ARIZASI

____________ TUMANI (SHAHRI) FUQAROLIK ISHLARI BO'YICHA
____________ SUDIGA

Da'vogar: ___________________________
          (F.I.O., tug'ilgan sanasi)
Manzil: _____________________________
Telefon: ____________________________

Javobgar: ___________________________
          (F.I.O. yoki tashkilot nomi)
Manzil: _____________________________

ARIZA

Men, _____________________ (F.I.O.), quyidagi masala bo'yicha sudga murojaat qilaman:

Nizo mohiyati:
_______________________________________________
_______________________________________________
_______________________________________________

Voqealar tartibi:
_____ yil _____ oy: ______________________________
_____ yil _____ oy: ______________________________

Huquqiy asos:
O'zbekiston Respublikasi ___________________ Kodeksining _____-moddasi.

O'TINAMAN:

1. _______________________________________________
2. _______________________________________________
3. Sud xarajatlarini javobgardan undirishni.

ILOVA:
- Dalil hujjatlari
- Guvohlar ro'yxati (mavjud bo'lsa)
- Davlat boji to'lovi cheki

Sana: _____ yil _____ oy _____ kun

Imzo: _____________ / _____________________ /`;
}
