export const CONSULTATION_PHONE = "+998918518551";
export const CONSULTATION_HOURS = "10:00 dan 20:00 gacha";

export const ARIZA_PRICE = 99000;
export const CONSULTATION_PRICE = 149000;

export const CARD_NUMBER = "9860 3501 4913 3539";
export const CARD_OWNER = "Javlonbek Azamatjonov";

export const ADMIN_ID = 1079088129;

export const ARIZA_TYPES = [
  {
    id: "divorce",
    label: "Nikohdan ajratish arizasi",
    description: "Nikohni rasman tugatish uchun sud arizasi",
    price: ARIZA_PRICE,
  },
  {
    id: "aliment",
    label: "Aliment to'lash arizasi",
    description: "Farzand boqish uchun aliment undirish arizasi",
    price: ARIZA_PRICE,
  },
  {
    id: "property",
    label: "Mulkni bo'lish arizasi",
    description: "Er-xotin mulkini taqsimlash uchun ariza",
    price: ARIZA_PRICE,
  },
  {
    id: "child_custody",
    label: "Farzand vasiyligini aniqlash",
    description: "Farzandning kim bilan yashashini belgilash arizasi",
    price: ARIZA_PRICE,
  },
  {
    id: "debt",
    label: "Qarz undirish arizasi",
    description: "Qarz yoki pul majburiyatlarini undirish arizasi",
    price: ARIZA_PRICE,
  },
  {
    id: "labor",
    label: "Mehnat nizosi arizasi",
    description: "Ishdan noto'g'ri bo'shatish yoki ish haqi bo'yicha ariza",
    price: ARIZA_PRICE,
  },
  {
    id: "other",
    label: "Boshqa ariza",
    description: "Boshqa turdagi sud arizasi",
    price: ARIZA_PRICE,
  },
] as const;

export type ArizaId = (typeof ARIZA_TYPES)[number]["id"];
