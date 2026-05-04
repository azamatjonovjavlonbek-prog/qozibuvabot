import TelegramBot from "node-telegram-bot-api";
import {
  ARIZA_CATEGORIES,
  PROFESSIONAL_TYPES,
  SHABLON_PRICE,
  CONSULTATION_PRICE,
} from "./config";

export function mainMenuKeyboard(): TelegramBot.InlineKeyboardMarkup {
  return {
    inline_keyboard: [
      [{ text: "📄 Ariza bo'limi", callback_data: "menu_ariza" }],
      [{ text: "📞 Konsultatsiya", callback_data: "menu_consultation" }],
    ],
  };
}

export function arizaMenuKeyboard(): TelegramBot.InlineKeyboardMarkup {
  return {
    inline_keyboard: [
      [{ text: `📝 Shablon ariza — ${SHABLON_PRICE.toLocaleString()} so'm`, callback_data: "menu_shablon" }],
      [{ text: "✍️ Professional ariza — 199 000 – 399 000 so'm", callback_data: "menu_professional" }],
      [{ text: "🔙 Orqaga", callback_data: "back_main" }],
    ],
  };
}

export function shablonListKeyboard(): TelegramBot.InlineKeyboardMarkup {
  const rows = ARIZA_CATEGORIES.map((c) => [
    { text: c.label, callback_data: `shablon_${c.id}` },
  ]);
  rows.push([{ text: "🔙 Orqaga", callback_data: "menu_ariza" }]);
  return { inline_keyboard: rows };
}

export function confirmShablonKeyboard(
  categoryId: string,
): TelegramBot.InlineKeyboardMarkup {
  return {
    inline_keyboard: [
      [
        {
          text: `💳 To'lov qilish (${SHABLON_PRICE.toLocaleString()} so'm)`,
          callback_data: `pay_shablon_${categoryId}`,
        },
      ],
      [{ text: "🔙 Orqaga", callback_data: "menu_shablon" }],
    ],
  };
}

export function professionalListKeyboard(): TelegramBot.InlineKeyboardMarkup {
  const rows = PROFESSIONAL_TYPES.map((p) => [
    {
      text: `${p.label} — ${p.price.toLocaleString()} so'm`,
      callback_data: `pro_${p.id}`,
    },
  ]);
  rows.push([{ text: "🔙 Orqaga", callback_data: "menu_ariza" }]);
  return { inline_keyboard: rows };
}

export function confirmProfessionalKeyboard(
  proId: string,
  price: number,
): TelegramBot.InlineKeyboardMarkup {
  return {
    inline_keyboard: [
      [
        {
          text: `💳 To'lov qilish (${price.toLocaleString()} so'm)`,
          callback_data: `pay_pro_${proId}`,
        },
      ],
      [{ text: "🔙 Orqaga", callback_data: "menu_professional" }],
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

export function cancelKeyboard(): TelegramBot.InlineKeyboardMarkup {
  return {
    inline_keyboard: [
      [{ text: "❌ Bekor qilish", callback_data: "back_main" }],
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
    approveData = `admin_ok_p:${userId}:${serviceId}`;
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

export function backToMainKeyboard(): TelegramBot.InlineKeyboardMarkup {
  return {
    inline_keyboard: [[{ text: "🏠 Bosh menyu", callback_data: "back_main" }]],
  };
}
