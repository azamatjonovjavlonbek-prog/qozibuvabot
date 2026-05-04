import TelegramBot from "node-telegram-bot-api";
import { ARIZA_TYPES, ARIZA_PRICE, CONSULTATION_PRICE } from "./config";

export function mainMenuKeyboard(): TelegramBot.InlineKeyboardMarkup {
  return {
    inline_keyboard: [
      [{ text: "📄 Ariza olish", callback_data: "menu_ariza" }],
      [{ text: "📞 Konsultatsiya", callback_data: "menu_consultation" }],
    ],
  };
}

export function arizaListKeyboard(): TelegramBot.InlineKeyboardMarkup {
  const rows = ARIZA_TYPES.map((a) => [
    { text: a.label, callback_data: `ariza_${a.id}` },
  ]);
  rows.push([{ text: "🔙 Orqaga", callback_data: "back_main" }]);
  return { inline_keyboard: rows };
}

export function confirmArizaKeyboard(
  arizaId: string,
): TelegramBot.InlineKeyboardMarkup {
  return {
    inline_keyboard: [
      [
        {
          text: `💳 To'lov qilish (${ARIZA_PRICE.toLocaleString()} so'm)`,
          callback_data: `pay_ariza_${arizaId}`,
        },
      ],
      [{ text: "🔙 Orqaga", callback_data: "menu_ariza" }],
    ],
  };
}

export function confirmConsultationKeyboard(): TelegramBot.InlineKeyboardMarkup {
  return {
    inline_keyboard: [
      [
        {
          text: `💳 To'lov qilish (${CONSULTATION_PRICE.toLocaleString()} so'm)`,
          callback_data: "pay_consultation",
        },
      ],
      [{ text: "🔙 Orqaga", callback_data: "back_main" }],
    ],
  };
}

export function backToMainKeyboard(): TelegramBot.InlineKeyboardMarkup {
  return {
    inline_keyboard: [[{ text: "🏠 Bosh menyu", callback_data: "back_main" }]],
  };
}
