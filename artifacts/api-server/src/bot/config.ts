export const CONSULTATION_PHONE = "+998918518551";

// Mini App URL — deployed domain dan olinadi
const _domain = (process.env["REPLIT_DOMAINS"] ?? "").split(",")[0]?.trim() ?? "";
export const MINI_APP_URL = _domain
  ? `https://${_domain}/mini-app/`
  : "";
export const CONSULTATION_HOURS = "10:00 dan 20:00 gacha";

export const SHABLON_PRICE = 29000;
export const CONSULTATION_PRICE = 99000;
export const PROFESSIONAL_PRICE_LABEL = "199 000 so'mdan 1 000 000 so'mgacha";

export const CARD_NUMBER = "9860 3501 4913 3539";
export const CARD_OWNER = "Javlonbek Azamatjonov";

// Telegram Payments provider tokenlari (@BotFather → /mybots → Payments dan olinadi)
export const PAYME_PROVIDER_TOKEN  = process.env["PAYME_PROVIDER_TOKEN"]  ?? process.env["PAYMENT_PROVIDER_TOKEN"] ?? "";
export const CLICK_PROVIDER_TOKEN  = process.env["CLICK_PROVIDER_TOKEN"]  ?? process.env["PAYMENT_PROVIDER_TOKEN"] ?? "";

export const ADMIN_ID = 1079088129;

export const REQUIRED_CHANNEL = "@yurist_azamatjonov";
export const CHANNEL_URL = "https://t.me/yurist_azamatjonov";

export const AI_CREDIT_PRICE = 50_000;
export const AI_FREE_CREDITS  = 10;
export const AI_PAID_CREDITS  = 5;

// Mehnatga haq to'lash eng kam miqdori (so'm) — zarurat bo'lganda yangilang
export const MZOT = 1_271_000;

// Respublika bo'yicha o'rtacha oylik nominal hisoblangan ish haqi (so'm)
// Ishlamaydigan qarzdorlar uchun hisob asosi — zarurat bo'lganda yangilang
export const AVG_SALARY = 6_461_299;

export const ARIZA_CATEGORIES = [
  { id: "divorce", label: "Nikohdan ajratish" },
  { id: "aliment", label: "Aliment undirish" },
  { id: "radar",   label: "Multiradar jarima bekor qilish" },
] as const;

export type ArizaCategoryId = (typeof ARIZA_CATEGORIES)[number]["id"];
