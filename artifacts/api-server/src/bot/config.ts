export const CONSULTATION_PHONE = "+998918518551";
export const CONSULTATION_HOURS = "10:00 dan 20:00 gacha";

export const SHABLON_PRICE = 89000;
export const CONSULTATION_PRICE = 149000;

export const CARD_NUMBER = "9860 3501 4913 3539";
export const CARD_OWNER = "Javlonbek Azamatjonov";

export const ADMIN_ID = 1079088129;

export const ARIZA_CATEGORIES = [
  { id: "divorce",       label: "Nikohdan ajratish" },
  { id: "aliment",       label: "Aliment undirish" },
  { id: "property",      label: "Mulkni bo'lish" },
  { id: "child_custody", label: "Farzand vasiyligini aniqlash" },
  { id: "debt",          label: "Qarz undirish" },
  { id: "labor",         label: "Mehnat nizosi" },
  { id: "other",         label: "Boshqa masala" },
] as const;

export type ArizaCategoryId = (typeof ARIZA_CATEGORIES)[number]["id"];

export const PROFESSIONAL_TYPES = [
  {
    id: "pro_divorce",
    label: "Nikohdan ajratish",
    price: 199000,
  },
  {
    id: "pro_aliment",
    label: "Aliment undirish",
    price: 199000,
  },
  {
    id: "pro_property",
    label: "Mulkni bo'lish",
    price: 299000,
  },
  {
    id: "pro_child_custody",
    label: "Farzand vasiyligini aniqlash",
    price: 299000,
  },
  {
    id: "pro_debt",
    label: "Qarz undirish",
    price: 299000,
  },
  {
    id: "pro_labor",
    label: "Mehnat nizosi",
    price: 399000,
  },
  {
    id: "pro_business",
    label: "Biznes / korporativ nizo",
    price: 399000,
  },
  {
    id: "pro_other",
    label: "Boshqa murakkab masala",
    price: 199000,
  },
] as const;

export type ProfessionalTypeId = (typeof PROFESSIONAL_TYPES)[number]["id"];
