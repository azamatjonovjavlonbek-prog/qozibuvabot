import TelegramBot from "node-telegram-bot-api";
import {
  ARIZA_CATEGORIES,
  SHABLON_PRICE,
  CONSULTATION_PRICE,
  PROFESSIONAL_PRICE_LABEL,
  AI_CREDIT_PRICE,
} from "./config";
import type { Lang } from "./userProfile";
import { t, tCatLabel, tProPrice } from "./i18n";

export function languageKeyboard(): TelegramBot.InlineKeyboardMarkup {
  return {
    inline_keyboard: [
      [
        { text: "🇺🇿 O'zbek (Lotin)", callback_data: "lang_latin" },
        { text: "🇺🇿 Ўзбек (Кирилл)", callback_data: "lang_cyrillic" },
      ],
    ],
  };
}

export function phoneKeyboard(lang: Lang): TelegramBot.ReplyKeyboardMarkup {
  return {
    keyboard: [[{ text: t(lang, "phone_share_btn"), request_contact: true }]],
    one_time_keyboard: true,
    resize_keyboard: true,
  };
}

export function removeKeyboard(): TelegramBot.ReplyKeyboardRemove {
  return { remove_keyboard: true };
}

export function mainMenuKeyboard(lang: Lang): TelegramBot.ReplyKeyboardMarkup {
  return {
    keyboard: [
      [
        { text: t(lang, "btn_ariza") },
        { text: t(lang, "btn_consultation") },
      ],
      [
        { text: t(lang, "btn_courts") },
        { text: t(lang, "btn_aliment") },
      ],
      [
        { text: t(lang, "btn_tahlil") },
        { text: t(lang, "btn_ai") },
      ],
      [
        { text: t(lang, "btn_about") },
      ],
      [
        { text: t(lang, "btn_clear") },
      ],
    ],
    resize_keyboard: true,
  };
}

export function arizaMenuKeyboard(lang: Lang): TelegramBot.InlineKeyboardMarkup {
  const shablonLabel = lang === "cyrillic"
    ? `📝 Шаблон ариза — ${SHABLON_PRICE.toLocaleString()} сўм`
    : `📝 Shablon ariza — ${SHABLON_PRICE.toLocaleString()} so'm`;
  const proLabel = lang === "cyrillic"
    ? `✍️ Профессионал ариза — ${tProPrice(lang)}`
    : `✍️ Professional ariza — ${tProPrice(lang)}`;
  return {
    inline_keyboard: [
      [{ text: shablonLabel,  callback_data: "menu_shablon" }],
      [{ text: proLabel,      callback_data: "menu_professional" }],
      [{ text: t(lang, "btn_back"), callback_data: "back_main" }],
    ],
  };
}

export function shablonListKeyboard(lang: Lang): TelegramBot.InlineKeyboardMarkup {
  const rows = ARIZA_CATEGORIES.map((c) => [
    { text: tCatLabel(lang, c.label), callback_data: `shablon_${c.id}` },
  ]);
  rows.push([{ text: t(lang, "btn_back"), callback_data: "menu_ariza" }]);
  return { inline_keyboard: rows };
}

export function confirmShablonKeyboard(
  categoryId: string,
  lang: Lang,
): TelegramBot.InlineKeyboardMarkup {
  const payLabel = lang === "cyrillic"
    ? `💳 Тўлов қилиш (${SHABLON_PRICE.toLocaleString()} сўм)`
    : `💳 To'lov qilish (${SHABLON_PRICE.toLocaleString()} so'm)`;
  return {
    inline_keyboard: [
      [{ text: payLabel, callback_data: `pay_shablon_${categoryId}` }],
      [{ text: t(lang, "btn_back"), callback_data: "menu_shablon" }],
    ],
  };
}

export function confirmProfessionalKeyboard(lang: Lang): TelegramBot.InlineKeyboardMarkup {
  return {
    inline_keyboard: [
      [{ text: t(lang, "btn_order"), callback_data: "pay_pro_general" }],
      [{ text: t(lang, "btn_back"), callback_data: "menu_ariza" }],
    ],
  };
}

export function confirmConsultationKeyboard(lang: Lang): TelegramBot.InlineKeyboardMarkup {
  const payLabel = lang === "cyrillic"
    ? `💳 Тўлов қилиш (${CONSULTATION_PRICE.toLocaleString()} сўм)`
    : `💳 To'lov qilish (${CONSULTATION_PRICE.toLocaleString()} so'm)`;
  return {
    inline_keyboard: [
      [{ text: payLabel, callback_data: "pay_consultation" }],
      [{ text: t(lang, "btn_back"), callback_data: "back_main" }],
    ],
  };
}

export function cancelKeyboard(lang: Lang): TelegramBot.InlineKeyboardMarkup {
  return {
    inline_keyboard: [
      [{ text: t(lang, "btn_cancel"), callback_data: "back_main" }],
    ],
  };
}

export function adminApproveKeyboard(
  userId: number,
  type: "shablon" | "professional" | "consultation",
  serviceId?: string,
): TelegramBot.InlineKeyboardMarkup {
  let approveData: string;
  if (type === "shablon") {
    approveData = `admin_ok_s:${userId}:${serviceId}`;
  } else if (type === "professional") {
    approveData = `admin_ok_p:${userId}`;
  } else {
    approveData = `admin_ok_c:${userId}`;
  }
  return {
    inline_keyboard: [
      [
        { text: "✅ Tasdiqlash", callback_data: approveData },
        { text: "❌ Rad etish", callback_data: `admin_no:${userId}` },
      ],
    ],
  };
}

export function backToMainKeyboard(lang: Lang = "latin"): TelegramBot.InlineKeyboardMarkup {
  return {
    inline_keyboard: [[{ text: t(lang, "btn_main"), callback_data: "back_main" }]],
  };
}

export function aiCreditsKeyboard(lang: Lang): TelegramBot.InlineKeyboardMarkup {
  const price = AI_CREDIT_PRICE.toLocaleString();
  const label = lang === "cyrillic"
    ? `💳 Тўлов қилиш (${price} сўм — 5 та савол)`
    : `💳 To'lov qilish (${price} so'm — 5 ta savol)`;
  return {
    inline_keyboard: [
      [{ text: label, callback_data: "pay_ai_credits" }],
      [{ text: t(lang, "btn_back"), callback_data: "back_main" }],
    ],
  };
}
