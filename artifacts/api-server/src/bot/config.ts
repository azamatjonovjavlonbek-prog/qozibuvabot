export const CONSULTATION_PHONE = "+998918518551";
export const CONSULTATION_HOURS = "10:00 dan 20:00 gacha";

export const SHABLON_PRICE = 89000;
export const CONSULTATION_PRICE = 149000;
export const PROFESSIONAL_PRICE_LABEL = "199 000 so'mdan 1 000 000 so'mgacha";

export const CARD_NUMBER = "9860 3501 4913 3539";
export const CARD_OWNER = "Javlonbek Azamatjonov";

export const ADMIN_ID = 1079088129;

// Mehnatga haq to'lash eng kam miqdori (so'm) — zarurat bo'lganda yangilang
export const MZOT = 1_271_000;

export const ARIZA_CATEGORIES = [
  { id: "divorce", label: "Nikohdan ajratish" },
  { id: "aliment", label: "Aliment undirish" },
  { id: "radar",   label: "Jarima (radar) bekor qilish" },
] as const;

export type ArizaCategoryId = (typeof ARIZA_CATEGORIES)[number]["id"];
