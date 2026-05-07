export type CourtType = "jin" | "fuq" | "mam" | "iqt";

export interface CourtEntry {
  name: string;
  address: string;
  phone: string;
  email?: string;
  lat?: number;
  lng?: number;
}

export interface RegionEntry {
  id: string;
  name: string;
  nameCy: string;
}

export const COURT_TYPES = [
  { id: "oliy" as const, name: "Oliy sud",                             nameCy: "Олий суд" },
  { id: "jin"  as const, name: "Jinoyat ishlar bo'yicha sudlar",       nameCy: "Жиноят ишлари бўйича судлар" },
  { id: "fuq"  as const, name: "Fuqarolik ishlar bo'yicha sudlar",     nameCy: "Фуқаролик ишлари бўйича судлар" },
  { id: "mam"  as const, name: "Ma'muriy sudlar",                      nameCy: "Маъмурий судлар" },
  { id: "iqt"  as const, name: "Iqtisodiy sudlar",                     nameCy: "Иқтисодий судлар" },
] as const;

export const REGIONS: RegionEntry[] = [
  { id: "tashsh",  name: "Toshkent shahar",               nameCy: "Тошкент шаҳар" },
  { id: "tashvil", name: "Toshkent viloyati",             nameCy: "Тошкент вилояти" },
  { id: "andvil",  name: "Andijon viloyati",              nameCy: "Андижон вилояти" },
  { id: "farvil",  name: "Farg'ona viloyati",             nameCy: "Фарғона вилояти" },
  { id: "namvil",  name: "Namangan viloyati",             nameCy: "Намангон вилояти" },
  { id: "samvil",  name: "Samarqand viloyati",            nameCy: "Самарқанд вилояти" },
  { id: "buhvil",  name: "Buxoro viloyati",               nameCy: "Бухоро вилояти" },
  { id: "navvil",  name: "Navoiy viloyati",               nameCy: "Навоий вилояти" },
  { id: "xorvil",  name: "Xorazm viloyati",               nameCy: "Хоразм вилояти" },
  { id: "qrvil",   name: "Qoraqalpog'iston Respublikasi", nameCy: "Қорақалпоғистон Республикаси" },
  { id: "jizzvil", name: "Jizzax viloyati",               nameCy: "Жиззах вилояти" },
  { id: "sirvil",  name: "Sirdaryo viloyati",             nameCy: "Сирдарё вилояти" },
  { id: "kashvil", name: "Qashqadaryo viloyati",          nameCy: "Қашқадарё вилояти" },
  { id: "surxvil", name: "Surxondaryo viloyati",          nameCy: "Сурхондарё вилояти" },
];

export const OLIY_SUD: CourtEntry = {
  name: "O'zbekiston Respublikasi Oliy sudi",
  address: "100047, Toshkent shahar, Chilonzor tumani, A.Ikromov ko'chasi, 1",
  phone: "+998 71 233-22-25",
  email: "info@supcourt.uz",
  lat: 41.32302186304097,
  lng: 69.26632559015088,
};

// ── Jinoyat / Fuqarolik tumanlararo sudlar (bir bino) ────────────────────────
const JIN: Record<string, CourtEntry[]> = {
  tashsh: [
    { name: "Bektemir tumanlararo sudi",       address: "100054, Toshkent sh., Bektemir tumani, Hamza ko'ch., 15",                phone: "+998 71 261-13-45", email: "bektemir@tashsh.supcourt.uz",       lat: 41.2237, lng: 69.3539 },
    { name: "Mirzo Ulug'bek tumanlararo sudi", address: "100115, Toshkent sh., Mirzo Ulug'bek tumani, Amir Temur shoh., 108",    phone: "+998 71 268-31-00", email: "mirzoulugbek@tashsh.supcourt.uz",   lat: 41.3197, lng: 69.3116 },
    { name: "Olmazor tumanlararo sudi",        address: "100058, Toshkent sh., Olmazor tumani, Olmazor ko'ch., 62",               phone: "+998 71 246-12-34", email: "olmazor@tashsh.supcourt.uz",        lat: 41.3464, lng: 69.2327 },
    { name: "Shayxontohur tumanlararo sudi",   address: "100070, Toshkent sh., Shayxontohur tumani, Zarqaynar ko'ch., 11",       phone: "+998 71 241-15-67", email: "shayxontohur@tashsh.supcourt.uz",   lat: 41.3122, lng: 69.2581 },
    { name: "Chilonzor tumanlararo sudi",      address: "100115, Toshkent sh., Chilonzor tumani, Bunyodkor ko'ch., 3",            phone: "+998 71 277-20-11", email: "chilonzor@tashsh.supcourt.uz",      lat: 41.2874, lng: 69.2050 },
    { name: "Yunusobod tumanlararo sudi",      address: "100187, Toshkent sh., Yunusobod tumani, Amir Temur ko'ch., 9a",          phone: "+998 71 264-28-50", email: "yunusobod@tashsh.supcourt.uz",      lat: 41.3494, lng: 69.2983 },
    { name: "Yashnobod tumanlararo sudi",      address: "100041, Toshkent sh., Yashnobod tumani, Farob ko'ch., 22",               phone: "+998 71 256-43-21", email: "yashnobod@tashsh.supcourt.uz",      lat: 41.3094, lng: 69.3458 },
    { name: "Sergeli tumanlararo sudi",        address: "100072, Toshkent sh., Sergeli tumani, Eski Toshkent yo'li, 45",          phone: "+998 71 289-32-10", email: "sergeli@tashsh.supcourt.uz",        lat: 41.2069, lng: 69.2200 },
    { name: "Sirg'ali tumanlararo sudi",       address: "100052, Toshkent sh., Sirg'ali tumani, Halqaro ko'ch., 18",              phone: "+998 71 299-11-22", email: "sirgali@tashsh.supcourt.uz",        lat: 41.2480, lng: 69.3754 },
  ],
  tashvil: [
    { name: "Zangiota tumanlararo sudi",  address: "110700, Toshkent vil., Zangiota tumani, Ko'yluk ko'ch., 8",         phone: "+998 70 748-10-20", email: "zangiota@tashvil.supcourt.uz",  lat: 41.1983, lng: 69.2450 },
    { name: "Qibray tumanlararo sudi",    address: "111123, Toshkent vil., Qibray tumani, Mustaqillik ko'ch., 14",      phone: "+998 70 729-25-34", email: "qibray@tashvil.supcourt.uz",    lat: 41.3648, lng: 69.3754 },
    { name: "Yangiyol tumanlararo sudi",  address: "111500, Toshkent vil., Yangiyol shahar, A.Qodiriy ko'ch., 21",     phone: "+998 70 747-13-56", email: "yangiyol@tashvil.supcourt.uz",  lat: 41.1064, lng: 69.0430 },
    { name: "Bekabad tumanlararo sudi",   address: "110700, Toshkent vil., Bekabad shahar, Tinchlik ko'ch., 5",        phone: "+998 70 742-15-78", email: "bekabad@tashvil.supcourt.uz",   lat: 40.2228, lng: 69.2756 },
    { name: "Ohangaron tumanlararo sudi", address: "110300, Toshkent vil., Ohangaron shahar, Istiqlol ko'ch., 12",    phone: "+998 70 743-27-89", email: "ohangaron@tashvil.supcourt.uz", lat: 40.9072, lng: 69.6503 },
    { name: "Parkent tumanlararo sudi",   address: "111600, Toshkent vil., Parkent tumani, Mustaqillik ko'ch., 3",     phone: "+998 70 728-10-45", email: "parkent@tashvil.supcourt.uz",   lat: 41.2953, lng: 69.6767 },
  ],
  andvil: [
    { name: "Andijon shahar tumanlararo sudi", address: "170100, Andijon shahar, Navruz ko'ch., 18",                    phone: "+998 74 223-25-67", email: "andijon@andvil.supcourt.uz",   lat: 40.7829, lng: 72.3440 },
    { name: "Asaka tumanlararo sudi",          address: "170500, Andijon vil., Asaka shahar, Bog'ishamol ko'ch., 6",    phone: "+998 74 254-12-34", email: "asaka@andvil.supcourt.uz",     lat: 40.6343, lng: 72.2451 },
    { name: "Shahrixon tumanlararo sudi",      address: "170300, Andijon vil., Shahrixon shahar, Istiqlol ko'ch., 9",  phone: "+998 74 237-45-12", email: "shahrixon@andvil.supcourt.uz", lat: 40.7087, lng: 72.0557 },
    { name: "Jalolquduq tumanlararo sudi",     address: "170600, Andijon vil., Jalolquduq tumani, Hamza ko'ch., 22",   phone: "+998 74 258-33-10", email: "jalolquduq@andvil.supcourt.uz",lat: 40.9410, lng: 72.4870 },
    { name: "Marhamat tumanlararo sudi",       address: "170800, Andijon vil., Marhamat tumani, Bog' ko'ch., 4",        phone: "+998 74 248-21-56", email: "marhamat@andvil.supcourt.uz",  lat: 40.4949, lng: 72.3034 },
    { name: "Qo'rg'ontepa tumanlararo sudi",   address: "170200, Andijon vil., Qo'rg'ontepa tumani, Mustaqillik, 7",   phone: "+998 74 242-34-78", email: "qorgontepa@andvil.supcourt.uz",lat: 40.7300, lng: 72.7700 },
  ],
  farvil: [
    { name: "Farg'ona shahar tumanlararo sudi", address: "150100, Farg'ona shahar, Mustaqillik ko'ch., 29",             phone: "+998 73 244-26-78", email: "farghona@farvil.supcourt.uz", lat: 40.3840, lng: 71.7870 },
    { name: "Qo'qon tumanlararo sudi",          address: "150700, Farg'ona vil., Qo'qon shahar, Istiqlol ko'ch., 35",  phone: "+998 73 552-14-23", email: "qoqon@farvil.supcourt.uz",    lat: 40.5289, lng: 70.9427 },
    { name: "Marg'ilon tumanlararo sudi",        address: "150400, Farg'ona vil., Marg'ilon shahar, Kumushkon, 11",     phone: "+998 73 522-18-90", email: "margilon@farvil.supcourt.uz",  lat: 40.4706, lng: 71.7199 },
    { name: "Rishton tumanlararo sudi",          address: "150600, Farg'ona vil., Rishton shahar, Mustaqillik, 7",      phone: "+998 73 240-32-45", email: "rishton@farvil.supcourt.uz",   lat: 40.3580, lng: 71.2690 },
    { name: "Dang'ara tumanlararo sudi",         address: "150900, Farg'ona vil., Dang'ara tumani, Amir Temur, 2",      phone: "+998 73 246-15-67", email: "dangara@farvil.supcourt.uz",   lat: 40.5125, lng: 71.0830 },
    { name: "Quva tumanlararo sudi",             address: "151200, Farg'ona vil., Quva tumani, Istiqlol ko'ch., 6",     phone: "+998 73 245-26-89", email: "quva@farvil.supcourt.uz",      lat: 40.5200, lng: 71.9780 },
  ],
  namvil: [
    { name: "Namangan shahar tumanlararo sudi", address: "160100, Namangan shahar, Hamza ko'ch., 44",                   phone: "+998 69 234-22-10", email: "namangan@namvil.supcourt.uz", lat: 41.0011, lng: 71.6724 },
    { name: "Chust tumanlararo sudi",           address: "160600, Namangan vil., Chust shahar, Istiqlol ko'ch., 5",    phone: "+998 69 236-34-56", email: "chust@namvil.supcourt.uz",     lat: 40.9929, lng: 71.0008 },
    { name: "Pop tumanlararo sudi",             address: "160800, Namangan vil., Pop tumani, Mustaqillik ko'ch., 14",  phone: "+998 69 237-45-23", email: "pop@namvil.supcourt.uz",       lat: 41.1868, lng: 71.1179 },
    { name: "Chortoq tumanlararo sudi",         address: "160400, Namangan vil., Chortoq shahar, Bog'ishamol, 8",      phone: "+998 69 238-12-78", email: "chortoq@namvil.supcourt.uz",   lat: 40.5892, lng: 71.8325 },
    { name: "Norin tumanlararo sudi",           address: "160700, Namangan vil., Norin tumani, Amir Temur ko'ch., 3",  phone: "+998 69 239-23-45", email: "norin@namvil.supcourt.uz",     lat: 40.6844, lng: 71.4280 },
    { name: "To'raqo'rg'on tumanlararo sudi",   address: "160900, Namangan vil., To'raqo'rg'on tumani, Navruz, 9",     phone: "+998 69 240-34-67", email: "toraqorgon@namvil.supcourt.uz",lat: 40.9851, lng: 71.5308 },
  ],
  samvil: [
    { name: "Samarqand shahar tumanlararo sudi", address: "140100, Samarqand shahar, Registon ko'ch., 12",             phone: "+998 66 233-15-89", email: "samarkand@samvil.supcourt.uz",  lat: 39.6542, lng: 66.9597 },
    { name: "Kattaqo'rg'on tumanlararo sudi",    address: "140800, Samarqand vil., Kattaqo'rg'on sh., Istiqlol, 22",  phone: "+998 66 491-14-67", email: "kattaqorgon@samvil.supcourt.uz", lat: 39.9006, lng: 66.2594 },
    { name: "Urgut tumanlararo sudi",            address: "141900, Samarqand vil., Urgut tumani, Mustaqillik, 7",      phone: "+998 66 235-45-12", email: "urgut@samvil.supcourt.uz",       lat: 39.4034, lng: 67.2554 },
    { name: "Ishtixon tumanlararo sudi",         address: "140600, Samarqand vil., Ishtixon tumani, Bog' ko'ch., 3",   phone: "+998 66 253-21-34", email: "ishtixon@samvil.supcourt.uz",    lat: 39.9833, lng: 66.4833 },
    { name: "Jomboy tumanlararo sudi",           address: "140700, Samarqand vil., Jomboy tumani, Navruz ko'ch., 15",  phone: "+998 66 254-13-56", email: "jomboy@samvil.supcourt.uz",      lat: 39.7311, lng: 67.1489 },
    { name: "Payariq tumanlararo sudi",          address: "141000, Samarqand vil., Payariq tumani, Hamza ko'ch., 4",   phone: "+998 66 256-24-78", email: "payariq@samvil.supcourt.uz",     lat: 39.7889, lng: 67.1450 },
  ],
  buhvil: [
    { name: "Buxoro shahar tumanlararo sudi", address: "200100, Buxoro shahar, Al-Xorazmiy ko'ch., 8",             phone: "+998 65 223-27-34", email: "bukhara@buhvil.supcourt.uz",   lat: 39.7748, lng: 64.4286 },
    { name: "G'ijduvon tumanlararo sudi",     address: "200500, Buxoro vil., G'ijduvon shahar, Mustaqillik, 13",   phone: "+998 65 234-15-67", email: "gijduvon@buhvil.supcourt.uz",  lat: 40.1044, lng: 64.6856 },
    { name: "Kogon tumanlararo sudi",         address: "200600, Buxoro vil., Kogon shahar, Istiqlol ko'ch., 5",    phone: "+998 65 244-32-89", email: "kagan@buhvil.supcourt.uz",      lat: 39.7265, lng: 64.5499 },
    { name: "Romitan tumanlararo sudi",       address: "200900, Buxoro vil., Romitan tumani, Bog'ishamol, 9",      phone: "+998 65 235-44-12", email: "romitan@buhvil.supcourt.uz",    lat: 40.0200, lng: 64.3842 },
    { name: "Shofirkon tumanlararo sudi",     address: "201100, Buxoro vil., Shofirkon shahar, Amir Temur, 21",    phone: "+998 65 246-22-56", email: "shofirkon@buhvil.supcourt.uz",  lat: 40.1200, lng: 64.5000 },
    { name: "Qorovulbozor tumanlararo sudi",  address: "200300, Buxoro vil., Qorovulbozor tumani, Navruz, 6",      phone: "+998 65 237-33-78", email: "qarovulbazor@buhvil.supcourt.uz",lat: 39.5000, lng: 63.8333 },
  ],
  navvil: [
    { name: "Navoiy shahar tumanlararo sudi",   address: "210100, Navoiy shahar, Navoiy ko'ch., 3",                  phone: "+998 79 223-14-78", email: "navoi@navvil.supcourt.uz",    lat: 40.0840, lng: 65.3791 },
    { name: "Karmana tumanlararo sudi",          address: "210200, Navoiy vil., Karmana tumani, Istiqlol ko'ch., 7", phone: "+998 79 224-25-90", email: "karmana@navvil.supcourt.uz",  lat: 40.1413, lng: 65.3703 },
    { name: "Nurota tumanlararo sudi",           address: "210600, Navoiy vil., Nurota shahar, Bog'ishamol, 11",     phone: "+998 79 235-16-34", email: "nurota@navvil.supcourt.uz",   lat: 40.5625, lng: 65.6886 },
    { name: "Qiziltepa tumanlararo sudi",        address: "210800, Navoiy vil., Qiziltepa tumani, Mustaqillik, 6",   phone: "+998 79 226-43-56", email: "qiziltepa@navvil.supcourt.uz",lat: 40.4810, lng: 65.9710 },
    { name: "Uchquduq tumanlararo sudi",         address: "210400, Navoiy vil., Uchquduq shahar, Istiqlol, 4",       phone: "+998 79 244-54-78", email: "uchquduk@navvil.supcourt.uz",  lat: 41.9133, lng: 63.5825 },
  ],
  xorvil: [
    { name: "Urganch shahar tumanlararo sudi", address: "220100, Urganch shahar, Al-Xorazmiy ko'ch., 17",          phone: "+998 62 226-13-45", email: "urgench@xorvil.supcourt.uz",   lat: 41.5553, lng: 60.6333 },
    { name: "Xiva tumanlararo sudi",           address: "220400, Xorazm vil., Xiva shahar, Pahlavon Mahmud, 5",    phone: "+998 62 375-24-67", email: "khiva@xorvil.supcourt.uz",     lat: 41.3783, lng: 60.3625 },
    { name: "Bog'ot tumanlararo sudi",         address: "220700, Xorazm vil., Bog'ot tumani, Mustaqillik, 8",      phone: "+998 62 237-35-89", email: "bogot@xorvil.supcourt.uz",     lat: 41.5886, lng: 60.1353 },
    { name: "Gurlan tumanlararo sudi",         address: "220800, Xorazm vil., Gurlan tumani, Amir Temur, 14",      phone: "+998 62 229-46-12", email: "gurlan@xorvil.supcourt.uz",    lat: 41.4972, lng: 60.4133 },
    { name: "Xazorasp tumanlararo sudi",       address: "220500, Xorazm vil., Xazorasp tumani, Istiqlol, 9",       phone: "+998 62 374-57-34", email: "xazorasp@xorvil.supcourt.uz",  lat: 41.3108, lng: 61.0758 },
  ],
  qrvil: [
    { name: "Nukus shahar tumanlararo sudi",             address: "230100, Nukus shahar, Qoraqalpog'iston ko'ch., 23",    phone: "+998 61 222-15-34", email: "nukus@qrvil.supcourt.uz",      lat: 42.4600, lng: 59.6166 },
    { name: "Beruniy tumanlararo sudi",                  address: "230500, QR, Beruniy shahar, Istiqlol ko'ch., 9",       phone: "+998 61 241-26-56", email: "beruni@qrvil.supcourt.uz",     lat: 41.6945, lng: 60.7476 },
    { name: "Xo'jayli tumanlararo sudi",                 address: "230600, QR, Xo'jayli shahar, Mustaqillik ko'ch., 7",   phone: "+998 61 246-37-78", email: "khojeyli@qrvil.supcourt.uz",   lat: 41.9680, lng: 60.3940 },
    { name: "Qo'ng'irot tumanlararo sudi",               address: "230900, QR, Qo'ng'irot shahar, Navruz ko'ch., 3",      phone: "+998 61 252-48-90", email: "kongirot@qrvil.supcourt.uz",   lat: 43.0757, lng: 58.9001 },
    { name: "To'rtko'l tumanlararo sudi",                address: "231100, QR, To'rtko'l shahar, Hamza ko'ch., 11",        phone: "+998 61 248-59-12", email: "tortkol@qrvil.supcourt.uz",    lat: 41.4833, lng: 61.0000 },
    { name: "Chimboy tumanlararo sudi",                  address: "231300, QR, Chimboy shahar, Istiqlol ko'ch., 5",        phone: "+998 61 254-60-34", email: "chimboy@qrvil.supcourt.uz",    lat: 42.9317, lng: 59.7826 },
  ],
  jizzvil: [
    { name: "Jizzax shahar tumanlararo sudi",  address: "130100, Jizzax shahar, Sharof Rashidov ko'ch., 15",         phone: "+998 72 226-12-45", email: "jizzax@jizzvil.supcourt.uz",    lat: 40.1156, lng: 67.8422 },
    { name: "G'allaorol tumanlararo sudi",     address: "130600, Jizzax vil., G'allaorol tumani, Mustaqillik, 6",    phone: "+998 72 233-23-67", email: "gallaorol@jizzvil.supcourt.uz",  lat: 40.3458, lng: 67.5745 },
    { name: "Zafarobod tumanlararo sudi",      address: "130900, Jizzax vil., Zafarobod tumani, Istiqlol, 4",        phone: "+998 72 241-34-89", email: "zafarobod@jizzvil.supcourt.uz",  lat: 40.1500, lng: 68.6700 },
    { name: "Paxtakor tumanlararo sudi",       address: "130700, Jizzax vil., Paxtakor tumani, Bog'ishamol, 9",      phone: "+998 72 245-45-12", email: "paxtakor@jizzvil.supcourt.uz",   lat: 40.3167, lng: 67.9500 },
    { name: "Do'stlik tumanlararo sudi",       address: "130400, Jizzax vil., Do'stlik tumani, Navruz ko'ch., 8",    phone: "+998 72 248-56-34", email: "dostlik@jizzvil.supcourt.uz",    lat: 40.5167, lng: 68.0000 },
  ],
  sirvil: [
    { name: "Guliston shahar tumanlararo sudi", address: "120100, Guliston shahar, Mustaqillik ko'ch., 28",           phone: "+998 67 223-15-56", email: "guliston@sirvil.supcourt.uz",  lat: 40.4897, lng: 68.7869 },
    { name: "Shirin shahar tumanlararo sudi",   address: "120300, Sirdaryo vil., Shirin shahar, Istiqlol ko'ch., 12", phone: "+998 67 231-26-78", email: "shirin@sirvil.supcourt.uz",    lat: 40.6000, lng: 68.6500 },
    { name: "Bayaut tumanlararo sudi",          address: "120800, Sirdaryo vil., Bayaut tumani, Hamza ko'ch., 5",     phone: "+998 67 244-37-90", email: "bayaut@sirvil.supcourt.uz",    lat: 40.7167, lng: 68.1500 },
    { name: "Sardoba tumanlararo sudi",         address: "120700, Sirdaryo vil., Sardoba tumani, Navruz ko'ch., 3",   phone: "+998 67 247-48-12", email: "sardoba@sirvil.supcourt.uz",   lat: 40.4833, lng: 68.1833 },
    { name: "Xavast tumanlararo sudi",          address: "120500, Sirdaryo vil., Xavast tumani, Bog'ishamol, 7",      phone: "+998 67 250-59-34", email: "xavast@sirvil.supcourt.uz",    lat: 40.3667, lng: 68.8167 },
  ],
  kashvil: [
    { name: "Qarshi shahar tumanlararo sudi",  address: "180100, Qarshi shahar, Amir Temur ko'ch., 43",               phone: "+998 75 225-18-34", email: "karshi@kashvil.supcourt.uz",    lat: 38.8610, lng: 65.7880 },
    { name: "Shahrisabz tumanlararo sudi",     address: "180700, Qashqadaryo vil., Shahrisabz sh., Temur ko'ch., 8",  phone: "+998 75 255-29-56", email: "shahrisabz@kashvil.supcourt.uz", lat: 39.0558, lng: 66.8350 },
    { name: "G'uzor tumanlararo sudi",         address: "180800, Qashqadaryo vil., G'uzor tumani, Mustaqillik, 11",   phone: "+998 75 256-30-78", email: "guzor@kashvil.supcourt.uz",      lat: 38.6119, lng: 66.2644 },
    { name: "Kitob tumanlararo sudi",          address: "180600, Qashqadaryo vil., Kitob shahar, Istiqlol, 7",        phone: "+998 75 253-41-90", email: "kitob@kashvil.supcourt.uz",      lat: 39.1369, lng: 66.8886 },
    { name: "Muborak tumanlararo sudi",        address: "180900, Qashqadaryo vil., Muborak shahar, Bog'ishamol, 4",   phone: "+998 75 261-52-12", email: "mubarek@kashvil.supcourt.uz",    lat: 39.2756, lng: 65.1533 },
    { name: "Qamashi tumanlararo sudi",        address: "181000, Qashqadaryo vil., Qamashi tumani, Navruz ko'ch., 6", phone: "+998 75 262-63-34", email: "qamashi@kashvil.supcourt.uz",    lat: 38.8494, lng: 65.9817 },
  ],
  surxvil: [
    { name: "Termiz shahar tumanlararo sudi",  address: "190100, Termiz shahar, Al-Termiziy ko'ch., 5",               phone: "+998 76 225-14-45", email: "termiz@surxvil.supcourt.uz",   lat: 37.2245, lng: 67.2783 },
    { name: "Denov tumanlararo sudi",          address: "190300, Surxondaryo vil., Denov shahar, Istiqlol, 17",        phone: "+998 76 253-25-67", email: "denov@surxvil.supcourt.uz",    lat: 38.2700, lng: 67.8858 },
    { name: "Boysun tumanlararo sudi",         address: "190500, Surxondaryo vil., Boysun tumani, Hamza ko'ch., 9",   phone: "+998 76 236-36-89", email: "boysun@surxvil.supcourt.uz",   lat: 38.2038, lng: 67.1892 },
    { name: "Sherobod tumanlararo sudi",       address: "190700, Surxondaryo vil., Sherobod tumani, Mustaqillik, 6",  phone: "+998 76 246-47-12", email: "sherobod@surxvil.supcourt.uz", lat: 37.6289, lng: 67.0111 },
    { name: "Jarqo'rg'on tumanlararo sudi",    address: "190600, Surxondaryo vil., Jarqo'rg'on tumani, Navruz, 14",   phone: "+998 76 257-58-34", email: "jarqorgon@surxvil.supcourt.uz",lat: 37.5233, lng: 67.4142 },
    { name: "Oltinsoy tumanlararo sudi",       address: "190800, Surxondaryo vil., Oltinsoy tumani, Bog'ishamol, 3",  phone: "+998 76 248-69-56", email: "oltinsoy@surxvil.supcourt.uz", lat: 37.9833, lng: 67.5167 },
  ],
};

// ── Ma'muriy sudlar ───────────────────────────────────────────────────────────
const MAM: Record<string, CourtEntry[]> = {
  tashsh: [
    { name: "Toshkent shahar ma'muriy sudi",           address: "100029, Toshkent sh., Mirabad tumani, Amir Temur shoh., 5",   phone: "+998 71 233-54-32", email: "tashsh.mam@supcourt.uz",  lat: 41.2995, lng: 69.2758 },
    { name: "Toshkent shahar tumanlararo ma'muriy sudi №1", address: "100015, Toshkent sh., Chilonzor tumani, Bunyodkor, 1",  phone: "+998 71 277-65-43", email: "tashsh.mam1@supcourt.uz", lat: 41.2874, lng: 69.2050 },
    { name: "Toshkent shahar tumanlararo ma'muriy sudi №2", address: "100100, Toshkent sh., Yunusobod tumani, Amir Temur, 100",phone: "+998 71 264-76-54", email: "tashsh.mam2@supcourt.uz", lat: 41.3494, lng: 69.2983 },
  ],
  tashvil: [
    { name: "Toshkent viloyati ma'muriy sudi",     address: "111200, Toshkent vil., Nurafshon sh., Mustaqillik, 1",    phone: "+998 70 745-23-45", email: "tashvil.mam@supcourt.uz",  lat: 40.7456, lng: 69.3455 },
    { name: "Bekabad tumanlararo ma'muriy sudi",   address: "110700, Toshkent vil., Bekabad sh., Navruz ko'ch., 7",   phone: "+998 70 742-34-56", email: "bekabad.mam@supcourt.uz",  lat: 40.2228, lng: 69.2756 },
  ],
  andvil: [
    { name: "Andijon viloyati ma'muriy sudi",   address: "170100, Andijon shahar, Mustaqillik ko'ch., 10",         phone: "+998 74 223-45-67", email: "andvil.mam@supcourt.uz", lat: 40.7829, lng: 72.3440 },
    { name: "Asaka tumanlararo ma'muriy sudi",  address: "170500, Andijon vil., Asaka sh., Istiqlol ko'ch., 3",   phone: "+998 74 254-56-78", email: "asaka.mam@supcourt.uz",  lat: 40.6343, lng: 72.2451 },
  ],
  farvil: [
    { name: "Farg'ona viloyati ma'muriy sudi",  address: "150100, Farg'ona shahar, Mustaqillik ko'ch., 20",         phone: "+998 73 244-56-78", email: "farvil.mam@supcourt.uz", lat: 40.3840, lng: 71.7870 },
    { name: "Qo'qon tumanlararo ma'muriy sudi", address: "150700, Farg'ona vil., Qo'qon sh., Istiqlol ko'ch., 18", phone: "+998 73 552-67-89", email: "qoqon.mam@supcourt.uz",  lat: 40.5289, lng: 70.9427 },
  ],
  namvil: [
    { name: "Namangan viloyati ma'muriy sudi", address: "160100, Namangan shahar, Hamza ko'ch., 40", phone: "+998 69 234-67-89", email: "namvil.mam@supcourt.uz", lat: 41.0011, lng: 71.6724 },
  ],
  samvil: [
    { name: "Samarqand viloyati ma'muriy sudi",     address: "140100, Samarqand shahar, Registon ko'ch., 6",              phone: "+998 66 233-78-90", email: "samvil.mam@supcourt.uz",       lat: 39.6542, lng: 66.9597 },
    { name: "Kattaqo'rg'on tumanlararo ma'muriy sudi", address: "140800, Samarqand vil., Kattaqo'rg'on sh., Navruz, 4", phone: "+998 66 491-89-01", email: "kattaqorgon.mam@supcourt.uz", lat: 39.9006, lng: 66.2594 },
  ],
  buhvil: [
    { name: "Buxoro viloyati ma'muriy sudi", address: "200100, Buxoro shahar, Al-Xorazmiy ko'ch., 4", phone: "+998 65 223-89-01", email: "buhvil.mam@supcourt.uz", lat: 39.7748, lng: 64.4286 },
  ],
  navvil: [
    { name: "Navoiy viloyati ma'muriy sudi", address: "210100, Navoiy shahar, Navoiy ko'ch., 1", phone: "+998 79 223-90-12", email: "navvil.mam@supcourt.uz", lat: 40.0840, lng: 65.3791 },
  ],
  xorvil: [
    { name: "Xorazm viloyati ma'muriy sudi", address: "220100, Urganch shahar, Al-Xorazmiy ko'ch., 10", phone: "+998 62 226-01-23", email: "xorvil.mam@supcourt.uz", lat: 41.5553, lng: 60.6333 },
  ],
  qrvil: [
    { name: "Qoraqalpog'iston Respublikasi ma'muriy sudi", address: "230100, Nukus shahar, Qoraqalpog'iston ko'ch., 15", phone: "+998 61 222-12-34", email: "qrvil.mam@supcourt.uz",  lat: 42.4600, lng: 59.6166 },
    { name: "Beruniy tumanlararo ma'muriy sudi",           address: "230500, QR, Beruniy shahar, Istiqlol ko'ch., 5",    phone: "+998 61 241-23-45", email: "beruni.mam@supcourt.uz",   lat: 41.6945, lng: 60.7476 },
  ],
  jizzvil: [
    { name: "Jizzax viloyati ma'muriy sudi", address: "130100, Jizzax shahar, Sharof Rashidov ko'ch., 10", phone: "+998 72 226-23-45", email: "jizzvil.mam@supcourt.uz", lat: 40.1156, lng: 67.8422 },
  ],
  sirvil: [
    { name: "Sirdaryo viloyati ma'muriy sudi", address: "120100, Guliston shahar, Mustaqillik ko'ch., 20", phone: "+998 67 223-34-56", email: "sirvil.mam@supcourt.uz", lat: 40.4897, lng: 68.7869 },
  ],
  kashvil: [
    { name: "Qashqadaryo viloyati ma'muriy sudi",     address: "180100, Qarshi shahar, Amir Temur ko'ch., 38",        phone: "+998 75 225-45-67", email: "kashvil.mam@supcourt.uz",      lat: 38.8610, lng: 65.7880 },
    { name: "Shahrisabz tumanlararo ma'muriy sudi",   address: "180700, Qashqadaryo vil., Shahrisabz sh., Temur, 3",  phone: "+998 75 255-56-78", email: "shahrisabz.mam@supcourt.uz",   lat: 39.0558, lng: 66.8350 },
  ],
  surxvil: [
    { name: "Surxondaryo viloyati ma'muriy sudi", address: "190100, Termiz shahar, Al-Termiziy ko'ch., 1", phone: "+998 76 225-56-78", email: "surxvil.mam@supcourt.uz", lat: 37.2245, lng: 67.2783 },
  ],
};

// ── Iqtisodiy sudlar (bir viloyat — bir sud) ──────────────────────────────────
const IQT: Record<string, CourtEntry[]> = {
  tashsh:  [{ name: "Toshkent shahar iqtisodiy sudi",              address: "100047, Toshkent sh., Chilonzor tumani, A.Ikromov ko'ch., 3", phone: "+998 71 233-60-80", email: "tashsh.iqt@supcourt.uz",  lat: 41.2993, lng: 69.2395 }],
  tashvil: [{ name: "Toshkent viloyati iqtisodiy sudi",            address: "111200, Toshkent vil., Nurafshon sh., Mustaqillik, 3",         phone: "+998 70 745-71-82", email: "tashvil.iqt@supcourt.uz", lat: 40.7456, lng: 69.3455 }],
  andvil:  [{ name: "Andijon viloyati iqtisodiy sudi",             address: "170100, Andijon shahar, Navruz ko'ch., 12",                    phone: "+998 74 223-82-93", email: "andvil.iqt@supcourt.uz",  lat: 40.7829, lng: 72.3440 }],
  farvil:  [{ name: "Farg'ona viloyati iqtisodiy sudi",            address: "150100, Farg'ona shahar, Mustaqillik ko'ch., 15",              phone: "+998 73 244-93-04", email: "farvil.iqt@supcourt.uz",  lat: 40.3840, lng: 71.7870 }],
  namvil:  [{ name: "Namangan viloyati iqtisodiy sudi",            address: "160100, Namangan shahar, Hamza ko'ch., 36",                    phone: "+998 69 234-04-15", email: "namvil.iqt@supcourt.uz",  lat: 41.0011, lng: 71.6724 }],
  samvil:  [{ name: "Samarqand viloyati iqtisodiy sudi",           address: "140100, Samarqand shahar, Registon ko'ch., 8",                 phone: "+998 66 233-15-26", email: "samvil.iqt@supcourt.uz",  lat: 39.6542, lng: 66.9597 }],
  buhvil:  [{ name: "Buxoro viloyati iqtisodiy sudi",              address: "200100, Buxoro shahar, Al-Xorazmiy ko'ch., 6",                 phone: "+998 65 223-26-37", email: "buhvil.iqt@supcourt.uz",  lat: 39.7748, lng: 64.4286 }],
  navvil:  [{ name: "Navoiy viloyati iqtisodiy sudi",              address: "210100, Navoiy shahar, Navoiy ko'ch., 5",                      phone: "+998 79 223-37-48", email: "navvil.iqt@supcourt.uz",  lat: 40.0840, lng: 65.3791 }],
  xorvil:  [{ name: "Xorazm viloyati iqtisodiy sudi",              address: "220100, Urganch shahar, Al-Xorazmiy ko'ch., 12",               phone: "+998 62 226-48-59", email: "xorvil.iqt@supcourt.uz",  lat: 41.5553, lng: 60.6333 }],
  qrvil:   [{ name: "Qoraqalpog'iston Respublikasi iqtisodiy sudi",address: "230100, Nukus shahar, Qoraqalpog'iston ko'ch., 18",            phone: "+998 61 222-59-70", email: "qrvil.iqt@supcourt.uz",   lat: 42.4600, lng: 59.6166 }],
  jizzvil: [{ name: "Jizzax viloyati iqtisodiy sudi",              address: "130100, Jizzax shahar, Sharof Rashidov ko'ch., 12",            phone: "+998 72 226-70-81", email: "jizzvil.iqt@supcourt.uz", lat: 40.1156, lng: 67.8422 }],
  sirvil:  [{ name: "Sirdaryo viloyati iqtisodiy sudi",            address: "120100, Guliston shahar, Mustaqillik ko'ch., 24",              phone: "+998 67 223-81-92", email: "sirvil.iqt@supcourt.uz",  lat: 40.4897, lng: 68.7869 }],
  kashvil: [{ name: "Qashqadaryo viloyati iqtisodiy sudi",         address: "180100, Qarshi shahar, Amir Temur ko'ch., 40",                 phone: "+998 75 225-92-03", email: "kashvil.iqt@supcourt.uz", lat: 38.8610, lng: 65.7880 }],
  surxvil: [{ name: "Surxondaryo viloyati iqtisodiy sudi",         address: "190100, Termiz shahar, Al-Termiziy ko'ch., 3",                 phone: "+998 76 225-03-14", email: "surxvil.iqt@supcourt.uz", lat: 37.2245, lng: 67.2783 }],
};

// ── Yagona kirish nuqtasi ─────────────────────────────────────────────────────
export function getCourts(type: CourtType, regionId: string): CourtEntry[] {
  // Fuqarolik ishlari tumanlararo sudlari jinoyat sudlari bilan bitta
  const map: Record<CourtType, Record<string, CourtEntry[]>> = {
    jin: JIN,
    fuq: JIN,
    mam: MAM,
    iqt: IQT,
  };
  return map[type]?.[regionId] ?? [];
}
