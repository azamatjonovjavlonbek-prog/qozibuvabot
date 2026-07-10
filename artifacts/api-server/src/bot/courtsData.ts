export type CourtType = "jin" | "fuq" | "mam" | "iqt";

export interface CourtEntry {
  name: string;
  address: string;
  phone: string;
  email?: string;
  jadval?: string;
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
  address: "100186, Toshkent sh., Shayxontohur tumani, Abdulla Qodiriy ko'chasi, 1-uy",
  phone: "+998 (71) 239-47-95",
  email: "devonxona.oliy@sud.uz",
  lat: 41.32302186304097,
  lng: 69.26632559015088,
};

// ── Jinoyat / Fuqarolik tumanlararo sudlar (bir bino) ────────────────────────
const JIN: Record<string, CourtEntry[]> = {
  tashsh: [
    { name: "Bektemir tuman sudi",          address: "Toshkent shahar, Bektemir tumani, X.Boyqaro ko'chasi, 9a uy",            phone: "+998 (71) 501-00-82", email: "j.bektemir@sud.uz",      lat: 41.2237, lng: 69.3539 },
    { name: "Mirzo Ulug'bek tuman sudi",  address: "Toshkent shahar, Sayram 7-tor ko'chasi, 2-uy",                          phone: "+998 (71) 501-00-69", email: "j.m-ulugbek@sud.uz",     lat: 41.3197, lng: 69.3116 },
    { name: "Mirobod tuman sudi",         address: "Toshkent shahar, Mirobod tumani, Fidokor ko'chasi, 38-uy",               phone: "+998 (71) 501-00-64", email: "j.mirobod@sud.uz",       lat: 41.2995, lng: 69.2758 },
    { name: "Olmazor tuman sudi",         address: "Toshkent shahar, Kichik halqa yo'li ko'chasi, 9-uy",                      phone: "+998 (71) 501-00-37", email: "j.olmazor@sud.uz",       lat: 41.3464, lng: 69.2327 },
    { name: "Sergeli tuman sudi",         address: "Toshkent shahar, Sirg'ali tumani, Yangi Sirg'ali ko'chasi",               phone: "+998 (71) 501-00-46", email: "j.sergeli@sud.uz",       lat: 41.2069, lng: 69.2200 },
    { name: "Toshkent shahar sudi",       address: "Toshkent shahri, Alisher Navoiy ko'chasi, 23 uy",                       phone: "+998 (71) 501-11-15", email: "j.toshkent@sud.uz",      lat: 41.2993, lng: 69.2395 },
    { name: "Uchtepa tuman sudi",         address: "Toshkent shahar, Foziltepa ko'chasi, 42a-uy",                           phone: "+998 (71) 501-00-93", email: "j.uchtepa@sud.uz",       lat: 41.2874, lng: 69.2050 },
    { name: "Chilonzor tuman sudi",       address: "Toshkent shahar, Sharq tongi ko'chasi, 1-a",                            phone: "+998 (71) 501-00-45", email: "j.chilonzor@sud.uz",     lat: 41.2874, lng: 69.2050 },
    { name: "Shayxontohur tuman sudi",    address: "Toshkent shahar, Shayxontohur tumani, Beruniy 3/4-uy",                   phone: "+998 (71) 501-00-31", email: "j.shayxontoxur@sud.uz",  lat: 41.3122, lng: 69.2581 },
    { name: "Yunusobod tuman sudi",       address: "Toshkent shahar, A.Temur ko'chasi, 133-uy",                              phone: "+998 (71) 501-00-59", email: "j.yunusobod@sud.uz",     lat: 41.3494, lng: 69.2983 },
    { name: "Yakkasaroy tuman sudi",      address: "Toshkent shahar, Shota Rustaveli ko'chasi, 62-uy",                        phone: "+998 (71) 501-00-86", email: "j.yakkasaroy@sud.uz",    lat: 41.2995, lng: 69.2758 },
    { name: "Yangihayot tuman sudi",      address: "Toshkent shahar, Yangihayot tumani, Lutflkor ko'chasi, 33-uy",            phone: "+998 (71) 501-06-03", email: "j.yangihayot@sud.uz",    lat: 41.3094, lng: 69.3458 },
    { name: "Yashnobod tuman sudi",       address: "Toshkent shahar, Yashnobod tumani, Taraqqiyot 1-berk ko'chasi, 8-uy",   phone: "+998 (71) 501-00-43", email: "j.yashnobod@sud.uz",     lat: 41.3094, lng: 69.3458 },
  ],
  tashvil: [
    { name: "Yangiyo'l shahar sudi",       address: "Toshkent viloyati, Yangyo'l shahar, Ibn-Sino ko'chasi, 20-uy",        phone: "+998 (55) 517-02-75", email: "j.yangiyul@sud.uz",        lat: 41.1064, lng: 69.0430 },
    { name: "Yangiyo'l tuman sudi",       address: "Toshkent viloyati, Yangyo'l shahar, Ibn-Sino ko'chasi, 20-uy",        phone: "+998 (55) 517-02-75", email: "j.yangiyul.t@sud.uz",      lat: 41.1064, lng: 69.0430 },
    { name: "Yuqorichirchiq tuman sudi",  address: "Toshkent viloyati, Yuqorichirchiq tumani, Yangibozor qo'rg'oni, Mustaqillik ko'chasi, 77-uy", phone: "+998 (55) 517-02-39", email: "j.yuqorichirchiq@sud.uz", lat: 41.2000, lng: 69.8000 },
    { name: "Chirchiq shahar sudi",       address: "Toshkent viloyati, Chirchiq shahar, A.Navoiy ko'chasi, 139-uy",       phone: "+998 (55) 517-02-70", email: "j.chirchiq@sud.uz",        lat: 41.4670, lng: 69.5850 },
    { name: "Chinoz tuman sudi",          address: "Toshkent viloyati, Chinoz tumani, Samarqand ko'chasi, 3-uy",          phone: "+998 (55) 517-02-82", email: "j.chinoz@sud.uz",          lat: 41.2000, lng: 68.7500 },
    { name: "O'rtachirchiq tuman sudi",   address: "Toshkent viloyati, Nurafshon shahar, Toshkent-yo'li ko'chasi, 240-uy", phone: "+998 (55) 517-02-80", email: "j.urtachirchiq@sud.uz",    lat: 41.2400, lng: 69.3500 },
    { name: "Toshkent tuman sudi",         address: "Toshkent viloyati, Toshkent tumani, Keles shahri, Keles-yo'li ko'chasi, 2-uy", phone: "+998 (55) 517-02-79", email: "j.toshkent.t@sud.uz",    lat: 41.3500, lng: 69.2200 },
    { name: "Pskent tuman sudi",           address: "Toshkent viloyati, Pskent tumani, M.Malikov ko'chasi, 1-uy",           phone: "+998 (55) 517-02-78", email: "j.pskent@sud.uz",          lat: 41.1500, lng: 69.5500 },
    { name: "Parkent tuman sudi",          address: "Toshkent viloyati, Parkent tumani, Kumushkon ko'chasi, 5-uy",         phone: "+998 (55) 517-02-76", email: "j.parkent@sud.uz",         lat: 41.2953, lng: 69.6767 },
    { name: "Ohangaron shahar sudi",      address: "Toshkent viloyati, Ohangaron shahar, Ezgulik ko'chasi, 100-uy",       phone: "+998 (55) 517-02-73", email: "j.oxangoron.sh@sud.uz",    lat: 40.9072, lng: 69.6503 },
    { name: "Ohangaron tuman sudi",        address: "Toshkent viloyati, Ohangaron shahar, Ezgulik ko'chasi, 100-uy",       phone: "+998 (55) 517-02-73", email: "j.oxangoron@sud.uz",       lat: 40.9072, lng: 69.6503 },
    { name: "Olmaliq shahar sudi",         address: "Toshkent viloyati, Olmaiq shahar, Ramazonov ko'chasi, 14A-uy",        phone: "+998 (55) 517-02-59", email: "j.olmalig@sud.uz",         lat: 40.8500, lng: 69.6000 },
    { name: "Oqqo'rg'on tuman sudi",       address: "Toshkent viloyati, Oqqo'rg'on tumani, Furqat ko'chasi, 1-uy",         phone: "+998 (55) 517-02-57", email: "j.oqqurgon@sud.uz",        lat: 41.1000, lng: 69.4000 },
    { name: "Nurafshon shahar sudi",       address: "Toshkent viloyati, Nurafshon shahar, Toshkent-yo'li ko'chasi, 240-uy", phone: "+998 (55) 517-02-56", email: "j.nurafshon@sud.uz",       lat: 41.2400, lng: 69.3500 },
    { name: "Quyichirchiq tuman sudi",    address: "Toshkent viloyati, Quyichirchiq tumani, Oqqo'rg'on ko'chasi, 1-uy",   phone: "+998 (55) 517-02-54", email: "j.quyichirchiq@sud.uz",    lat: 41.1000, lng: 69.3000 },
    { name: "Qibray tuman sudi",           address: "Toshkent viloyati, Qibray tumani, Zebiniso ko'chasi, 10-uy",         phone: "+998 (55) 517-02-53", email: "j.qibray@sud.uz",          lat: 41.3648, lng: 69.3754 },
    { name: "Zangiota tuman sudi",         address: "Toshkent viloyati, Zangiota tumani, Eshonguzar qo'rg'oni, Mustaqillik ko'chasi, 20-uy", phone: "+998 (55) 517-02-37", email: "j.zangiota@sud.uz",       lat: 41.1983, lng: 69.2450 },
    { name: "Bo'stonliq tuman sudi",       address: "Toshkent viloyati, Bo'stonliq tumani, Fazalkent shahararchasi, Lutifiy ko'chasi, 1-uy", phone: "+998 (55) 517-02-36", email: "j.bustonliq@sud.uz",      lat: 41.5000, lng: 69.8000 },
    { name: "Bo'ka tuman sudi",            address: "Toshkent viloyati, Bo'ka tumani, Moxira Maxmudova ko'chasi, 1-uy",   phone: "+998 (55) 517-02-30", email: "j.buka@sud.uz",            lat: 41.3000, lng: 69.6000 },
    { name: "Bekobod shahar sudi",         address: "Toshkent viloyati, Bekobod shahar, Istiqlol ko'chasi, 15-uy",        phone: "+998 (55) 517-42-42", email: "j.bekobod@sud.uz",         lat: 40.2228, lng: 69.2756 },
    { name: "Bekobod tuman sudi",          address: "Toshkent viloyati, Bekobod tumani, Zafar shaharcheasi, Mustaqillik ko'chasi, 13-uy", phone: "+998 (55) 517-02-31", email: "j.bekobod.t@sud.uz",     lat: 40.2228, lng: 69.2756 },
    { name: "Angren shahar sudi",          address: "Toshkent viloyati, Angren shahar, Bunyodkor ko'chasi, 1-uy",          phone: "+998 (55) 517-02-35", email: "j.angren@sud.uz",          lat: 40.9500, lng: 69.9500 },
    { name: "Toshkent viloyat sudi",       address: "Toshkent shahar, Yakkasaroy tumani, Sh.Rustaveli ko'chasi, 93-uy",     phone: "+998 (55) 510-74-74", email: "j.toshkent.v@sud.uz",      lat: 41.2995, lng: 69.2758 },
  ],
  andvil: [
    { name: "Andijon viloyat sudi",     address: "Andijon shahar, Alisher Navoiy shoh ko'chasi, 15-uy",        phone: "+998 (74) 224-42-44", email: "j.andijon@sud.uz",      lat: 40.7829, lng: 72.3440 },
    { name: "Andijon tuman sudi",       address: "Andijon tumani, Sanoat MFY, Oltin vodiy ko'chasi 4-uy",      phone: "+998 (74) 224-07-67", email: "j.andijon.t@sud.uz",    lat: 40.8300, lng: 72.3200 },
    { name: "Andijon shahar sudi",      address: "Andijon shahar, Toshkent ko'chasi, 4-uy",                    phone: "+998 (74) 224-07-37", email: "j.andijon.sh@sud.uz",   lat: 40.7850, lng: 72.3400 },
    { name: "Asaka tuman sudi",         address: "Asaka tumani, Sohil bo'yi ko'chasi 11-uy",                   phone: "+998 (74) 224-07-87", email: "j.asaka@sud.uz",        lat: 40.6400, lng: 72.2400 },
    { name: "Baliqchi tuman sudi",      address: "Baliqchi tuman, Andijon ko'chasi, 1-uy",                     phone: "+998 (74) 224-07-97", email: "j.baliqchi@sud.uz",     lat: 40.8900, lng: 72.0800 },
    { name: "Buloqboshi tuman sudi",    address: "Buloqboshi tuman, Uzumzor ko'chasi, 162-uy",                phone: "+998 (74) 224-17-47", email: "j.buloqboshi@sud.uz",   lat: 40.6200, lng: 72.4700 },
    { name: "Bo'z tuman sudi",          address: "Bo'z tuman, Mustaqillik ko'chasi 36-uy",                      phone: "+998 (74) 224-17-27", email: "j.buz@sud.uz",          lat: 40.6800, lng: 72.6000 },
    { name: "Jalaquduq tuman sudi",     address: "Jalaquduq tumani, Tuyalas MFY, Mashriq ko'chasi, 2-uy",      phone: "+998 (74) 224-17-67", email: "j.jalaquduq@sud.uz",    lat: 40.9400, lng: 72.4900 },
    { name: "Izboskan tuman sudi",      address: "Izboskan tuman, J.Siddikov ko'chasi 3-uy",                   phone: "+998 (74) 224-17-87", email: "j.izboskan@sud.uz",     lat: 40.7200, lng: 72.3000 },
    { name: "Qo'rg'ontepa tuman sudi",  address: "Qo'rg'ontepa tuman, Mustaqillik ko'chasi, 50-uy",            phone: "+998 (74) 224-17-97", email: "j.qurgontepa@sud.uz",   lat: 40.7300, lng: 72.7700 },
    { name: "Marhamat tuman sudi",      address: "Marhamat tumani, Mustaqilliki ko'chasi 33-uy",               phone: "+998 (74) 224-27-07", email: "j.marxamat@sud.uz",     lat: 40.4949, lng: 72.3034 },
    { name: "Oltinko'l tuman sudi",     address: "Oltinko'l tuman, Chinobod shox ko'chasi, 15-uy",            phone: "+998 (74) 224-27-17", email: "j.oltinkul@sud.uz",     lat: 40.5500, lng: 72.2200 },
    { name: "Paxtaobod tuman sudi",     address: "Paxtaobod tuman, Muazzimboy ko'chasi, 1-uy",                phone: "+998 (74) 224-27-17", email: "j.paxtaobod@sud.uz",    lat: 40.5800, lng: 72.2800 },
    { name: "Ulug'nor tuman sudi",      address: "Ulug'nor tumani, Mustaqillik ko'chasi, 3-uy",                 phone: "+998 (74) 224-47-27", email: "j.ulugnor@sud.uz",      lat: 40.6700, lng: 72.3500 },
    { name: "Xonobod shahar sudi",      address: "Xonobod shahar, Bog'ibaland ko'chasi, 1-uy",                 phone: "+998 (74) 224-27-57", email: "j.xonobod@sud.uz",      lat: 40.6800, lng: 72.4500 },
    { name: "Xo'jaobod tuman sudi",     address: "Xo'jaobod tuman, Uzun ko'chasi 2-uy",                        phone: "+998 (74) 224-27-67", email: "j.xujaobod@sud.uz",     lat: 40.6500, lng: 72.5000 },
    { name: "Shahrixon tuman sudi",     address: "Shahrixon tuman, R.Yodgorov ko'chasi, 3-uy",                phone: "+998 (74) 224-27-87", email: "j.shahrixon@sud.uz",    lat: 40.7087, lng: 72.0557 },
  ],
  farvil: [
    { name: "Farg'ona viloyat sudi",        address: "Farg'ona shahar, Sohibqiron Temur ko'chasi, 30-uy",               phone: "+998 (73) 249-01-01", email: "j.fargona@sud.uz",       lat: 40.3840, lng: 71.7870 },
    { name: "Farg'ona shahar sudi",         address: "Farg'ona shahar, Yuksalish ko'chasi, 103-uy",                    phone: "+998 (73) 249-15-01", email: "j.fargona.sh@sud.uz",    lat: 40.3840, lng: 71.7870 },
    { name: "Farg'ona tuman sudi",          address: "Farg'ona tumani, Vodil shaharcheasi, Buloqboshi ko'chasi, raqamsiz uy", phone: "+998 (73) 249-15-02", email: "j.fargona.t@sud.uz",     lat: 40.3500, lng: 71.7500 },
    { name: "Qo'qon shahar sudi",            address: "Qo'qon shahar, I.Buhariy ko'chasi, 37-uy",                       phone: "+998 (73) 249-15-03", email: "j.quqon@sud.uz",         lat: 40.5289, lng: 70.9427 },
    { name: "O'zbekiston tuman sudi",        address: "O'zbekiston tumani, Konizor qishlog'i, A.Navoiy ko'chasi, 18-uy", phone: "+998 (73) 249-15-04", email: "j.uzbekiston@sud.uz",    lat: 40.4500, lng: 71.2000 },
    { name: "Beshariq tuman sudi",          address: "Beshariq tumani, Oltin Vodiy ko'chasi, 101-uy",                  phone: "+998 (73) 249-15-06", email: "j.beshariq@sud.uz",      lat: 40.4300, lng: 71.0000 },
    { name: "Bog'dod tuman sudi",            address: "Bog'dod tumani, Orzu ko'chasi",                                   phone: "+998 (73) 249-15-07", email: "j.bogdod@sud.uz",        lat: 40.5200, lng: 71.2000 },
    { name: "Buvayda tuman sudi",           address: "Buvayda tumani, Yangi qo'rg'on shaharcheasi, Bog'eram ko'chasi, 56-uy", phone: "+998 (73) 249-15-08", email: "j.buvayda@sud.uz",       lat: 40.5500, lng: 71.1000 },
    { name: "Dang'ara tuman sudi",          address: "Dang'ara tumani, Muqumiy ko'chasi, 2-uy",                        phone: "+998 (73) 249-15-09", email: "j.dangara@sud.uz",       lat: 40.5125, lng: 71.0830 },
    { name: "Yozyovon tuman sudi",         address: "Yozyovon tumani, Yozyovon shaharcheasi, Xidoyat ko'chasi, 3-uy", phone: "+998 (73) 249-15-10", email: "j.yozyovon@sud.uz",      lat: 40.6000, lng: 71.6500 },
    { name: "Quva tuman sudi",              address: "Quva tumani, Qayqubbot ko'chasi, 184-uy",                        phone: "+998 (73) 249-15-11", email: "j.quva@sud.uz",          lat: 40.5200, lng: 71.9780 },
    { name: "Qo'ushtepa tuman sudi",        address: "Qo'ushtepa tumani, Mirobod ko'chasi",                             phone: "+998 (73) 249-15-12", email: "j.qushtepa@sud.uz",      lat: 40.6200, lng: 71.7500 },
    { name: "Marg'ilon shahar sudi",         address: "Marg'ilon shahar, Nurafshon ko'chasi, 9-uy",                     phone: "+998 (73) 249-15-13", email: "j.margulon@sud.uz",      lat: 40.4706, lng: 71.7199 },
    { name: "Oltiariq tuman sudi",          address: "Oltiariq tumani, Oltiariq shaharcheasi, O'zbekiston ko'chasi, 28-uy", phone: "+998 (73) 249-15-14", email: "j.oltiariq@sud.uz",      lat: 40.3900, lng: 71.5000 },
    { name: "Rishton tuman sudi",           address: "Rishton tumani, Markaz MFY, Roshidoniya ko'chasi, 187A-uy",      phone: "+998 (73) 249-15-15", email: "j.rishton@sud.uz",       lat: 40.3580, lng: 71.2690 },
    { name: "So'x tuman sudi",              address: "So'x tumani, Rovon shaharcheasi, A.Temur ko'chasi, 187-uy",      phone: "+998 (73) 249-15-16", email: "j.sux@sud.uz",           lat: 40.3000, lng: 71.0500 },
    { name: "Toshloq tuman sudi",          address: "Toshloq tumani, Dovon ko'chasi, 93-uy",                         phone: "+998 (73) 249-15-17", email: "j.toshloq@sud.uz",       lat: 40.4800, lng: 71.7800 },
    { name: "Uchko'prik tuman sudi",        address: "Uchko'prik tumani, X.Olimjon ko'chasi, 80-uy",                   phone: "+998 (73) 249-15-18", email: "j.uchkuprik@sud.uz",     lat: 40.5500, lng: 71.0000 },
    { name: "Furqat tuman sudi",            address: "Furqat tumani, Ardaxshon qishlog'i, Tayanch ko'chasi, 5-uy",     phone: "+998 (73) 249-15-19", email: "j.furqat@sud.uz",        lat: 40.5000, lng: 71.2000 },
    { name: "Quvasoy shahar sudi",          address: "Quvasoy shahar, Mustaqillik ko'chasi, 95-uy",                     phone: "+998 (73) 249-70-71", email: "j.quvasoy@sud.uz",       lat: 40.3000, lng: 71.9700 },
  ],
  namvil: [
    { name: "Namangan viloyat sudi",          address: "Namangan shahri, N. Namangoniy ko'chasi, 10 uy",             phone: "+998 (69) 211-17-77", email: "j.namangan@sud.uz",           lat: 41.0011, lng: 71.6724 },
    { name: "Yangiqo'rg'on tuman sudi",       address: "Yangiqo'rg'on tumani",                                          phone: "+998 (69) 211-11-09", email: "j.yangiqurgon@sud.uz",       lat: 40.9929, lng: 71.0008 },
    { name: "Chust tuman sudi",                address: "Chust shahar, Karamsada MFY, Charag'on ko'chasi, 74-uy",       phone: "+998 (69) 211-10-95", email: "j.chust@sud.uz",             lat: 41.0931, lng: 71.2393 },
    { name: "Chortoq tuman sudi",              address: "Chortoq tumani, Mustaqillik shox kochasi, 4 uy",                phone: "+998 (69) 211-10-86", email: "j.chortoq@sud.uz",           lat: 41.0239, lng: 71.6701 },
    { name: "Uchqo'rg'on tuman sudi",          address: "Uchqo'rg'on tumani, Lutfiy ko'chasi, 2 uy",                     phone: "+998 (69) 211-10-69", email: "j.uchqurgon@sud.uz",         lat: 41.1088, lng: 71.7365 },
    { name: "Uyichi tuman sudi",               address: "Uyichi tumani, Uyichi shahararchasi, Beruniy ko'chasi",       phone: "+998 (69) 211-10-88", email: "j.uychi@sud.uz",             lat: 40.9919, lng: 71.0503 },
    { name: "To'raqo'rg'on tuman sudi",        address: "To'raqo'rg'on shahri, Al-Fargoniy ko'chasi, 2-uy",             phone: "+998 (69) 211-10-59", email: "j.turaqurgon@sud.uz",        lat: 41.0402, lng: 71.5667 },
    { name: "Pop tuman sudi",                  address: "Pop shahar, E.Yondosh ko'chasi, 7-uy",                          phone: "+998 (69) 211-10-53", email: "j.pop@sud.uz",               lat: 40.8736, lng: 71.1089 },
    { name: "Norin tuman sudi",                address: "Norin tumani, Xaqulobod shahri, Beruniy kochasi, 21 uy",        phone: "+998 (69) 211-10-39", email: "j.norin@sud.uz",             lat: 41.0001, lng: 71.2150 },
    { name: "Namangan shahar sudi",            address: "Namangan shahar, N.Nomongoniy ko'chasi, 10-uy",                  phone: "+998 (69) 211-10-36", email: "j.namangan.sh@sud.uz",       lat: 41.0011, lng: 71.6724 },
    { name: "Namangan tuman sudi",             address: "Namangan tumani, Toshbuloq shahararchasi, N.Oxunov ko'chasi, 3-uy", phone: "+998 (69) 211-10-98", email: "j.namangan.t@sud.uz",       lat: 41.0103, lng: 71.6490 },
    { name: "Mingbuloq tuman sudi",            address: "Mingbuloq tumani, Jomasho'y shahararchasi, Ozodlik ko'chasi",   phone: "+998 (69) 211-12-55", email: "j.mingbuloq@sud.uz",         lat: 41.0861, lng: 71.6833 },
    { name: "Kosonsoy tuman sudi",             address: "Kosonsoy shahar, Gulobod ko'chasi, 11-uy",                      phone: "+998 (69) 211-10-81", email: "j.kosonsoy@sud.uz",          lat: 41.2476, lng: 71.5430 },
  ],
  samvil: [
    { name: "Samarqand viloyat sudi",             address: "Samarqand shahar, Mingtut ko'chasi 1-uy",                       phone: "+998 (55) 706-70-05", email: "j.samarqand@sud.uz",         lat: 39.6542, lng: 66.9597 },
    { name: "Urgut tuman sudi",                   address: "Urgut tuman, Urgut shahri, Qoratera ko'chasi",                 phone: "+998 (55) 706-70-26", email: "j.urgut@sud.uz",             lat: 39.4034, lng: 67.2554 },
    { name: "Tayloq tuman sudi",                  address: "Tayloq tumani, Mustaqillik ko'chasi, 8-uy",                    phone: "+998 (55) 706-70-25", email: "j.tayloq@sud.uz",            lat: 39.5647, lng: 66.8454 },
    { name: "Samarqand shahar sudi",              address: "Samarqand shahri, Bernuiy ko'chasi 65-uy",                       phone: "+998 (55) 706-70-07", email: "j.samarqand.sh@sud.uz",      lat: 39.6542, lng: 66.9597 },
    { name: "Samarqand tuman sudi",               address: "Samarqand tuman Xo'ja Axror Vali-1 mahallasi",                 phone: "+998 (55) 706-70-24", email: "j.samarqand.t@sud.uz",       lat: 39.6311, lng: 66.9723 },
    { name: "Paxtachi tuman sudi",                address: "Paxtachi tuman, Ziyovuddin shahararchasi, mustaqillik ko'chasi, 48-uy", phone: "+998 (55) 706-70-23", email: "j.paxtachi@sud.uz",        lat: 39.8847, lng: 67.0134 },
    { name: "Pastdarg'om tuman sudi",             address: "Pastdarg'om tumani, Juma shahri, A.Temur ko'chasi",            phone: "+998 (55) 706-70-22", email: "j.pastdargom@sud.uz",       lat: 39.6828, lng: 66.9847 },
    { name: "Payariq tuman sudi",                 address: "Payariq tuman, Chelak shahri, Istiqlol ko'chasi, 59-uy",       phone: "+998 (55) 706-70-21", email: "j.payariq@sud.uz",          lat: 39.7889, lng: 67.1450 },
    { name: "Oqdaryo tuman sudi",                 address: "Loyish shahararchasi, A.Temur ko'chasi, 17-uy",                phone: "+998 (55) 706-70-19", email: "j.oqdaryo@sud.uz",          lat: 39.8489, lng: 67.0200 },
    { name: "Nurobod tuman sudi",                 address: "Nurobod shahri, Amir Temur ko'chasi, 14 uy",                    phone: "+998 (55) 706-70-17", email: "j.nurabod@sud.uz",          lat: 39.6789, lng: 66.8100 },
    { name: "Narpay tuman sudi",                  address: "Narpay tuman, Oqtosh shahri, I.Buxoriy ko'chasi, 5-uy",        phone: "+998 (55) 706-70-16", email: "j.narpay@sud.uz",           lat: 40.0489, lng: 65.8150 },
    { name: "Qo'shrabot tuman sudi",              address: "Qo'shrabot tumani, G'ofur G'ulom ko'chasi, 1-uy",              phone: "+998 (55) 706-70-15", email: "j.qushrabot@sud.uz",        lat: 39.7356, lng: 67.0800 },
    { name: "Kattaqo'rg'on shahar sudi",          address: "Kattaqo'rg'on shahar A.Navoiy ko'chasi 105-uy",               phone: "+998 (55) 706-70-14", email: "j.kattaqurgon@sud.uz",      lat: 39.9006, lng: 66.2594 },
    { name: "Kattaqo'rg'on tuman sudi",           address: "Kattaqo'rg'on tumani, Mustaqillik ko'chasi, 37-uy",             phone: "+998 (55) 706-70-13", email: "j.kattaqurgon.t@sud.uz",    lat: 39.9200, lng: 66.2800 },
    { name: "Ishtixon tuman sudi",                address: "Ishtixon shahri, Ishtixon ko'chasi, 11-uy",                    phone: "+998 (55) 706-70-12", email: "j.ishtixon@sud.uz",         lat: 39.9833, lng: 66.4833 },
    { name: "Jomboy tuman sudi",                  address: "Jomboy shahri, Galakapa ko'chasi,15-uy",                       phone: "+998 (55) 706-70-11", email: "j.jomboy@sud.uz",           lat: 39.7311, lng: 67.1489 },
    { name: "Bulung'ur tuman sudi",               address: "Bulung'ur tumani, do'slik ko'chasi, 24-uy",                   phone: "+998 (55) 706-70-09", email: "j.bulungur@sud.uz",         lat: 39.8700, lng: 67.2200 },
  ],
  buhvil: [
    { name: "Buxoro viloyat sudi",         address: "Buxoro shahar, Hofiz Tonish Buxoriy ko'chasi, 13-uy",       phone: "+998 (65) 220-01-14", email: "j.buxoro@sud.uz",        lat: 40.119275, lng: 64.505071 },
    { name: "Buxoro tuman sudi",           address: "Buxoro tumani, Bahor ko'chasi, 25-uy",                    phone: "+998 (65) 220-02-27", email: "j.buxoro.t@sud.uz",      lat: 39.860174, lng: 64.441550 },
    { name: "Buxoro shahar sudi",          address: "Buxoro shahar, I.Mo'minov ko'chasi, 28-uy",               phone: "+998 (65) 220-02-24", email: "j.buxoro.sh@sud.uz",     lat: 39.766136, lng: 64.437081 },
    { name: "Vobkent tuman sudi",          address: "Vobkent shahri, F.Xo'jaev ko'chasi, 21-uy",              phone: "+998 (65) 220-05-51", email: "j.vobkent@sud.uz",       lat: 40.022274, lng: 64.519762 },
    { name: "G'ijduvon tuman sudi",        address: "G'ijduvon shahar, Mustaqillik ko'chasi, 2-uy",            phone: "+998 (65) 220-05-69", email: "j.gijduvon@sud.uz",      lat: 40.103302, lng: 64.682274 },
    { name: "Jondor tuman sudi",           address: "Jondor tuman, M.Tarobiy ko'chasi, 2-uy",                  phone: "+998 (65) 220-07-38", email: "j.jondor@sud.uz",        lat: 39.738430, lng: 64.173792 },
    { name: "Kogon tuman sudi",            address: "Kogon shahar, Qorovulbozor shoh ko'chasi, 2-uy",          phone: "+998 (65) 220-03-14", email: "j.kogon.t@sud.uz",       lat: 39.732115, lng: 64.527760 },
    { name: "Kogon shahar sudi",           address: "Kogon shahar, Qorovulbozor shoh ko'chasi, 2-uy",          phone: "+998 (65) 220-02-81", email: "j.kogon@sud.uz",         lat: 39.732115, lng: 64.527760 },
    { name: "Qorako'l tuman sudi",         address: "Qorako'l shahri, Toshkent ko'chasi, 28-uy",              phone: "+998 (65) 220-05-72", email: "j.qorakul@sud.uz",       lat: 39.518897, lng: 63.847969 },
    { name: "Qorovulbozor tuman sudi",     address: "Qorovulbozor tumani, Nodira ko'chasi, 10-uy",            phone: "+998 (65) 220-07-42", email: "j.qoravulbozor@sud.uz",  lat: 39.497841, lng: 64.787976 },
    { name: "Olot tuman sudi",             address: "Olot shahar, Olot ko'chasi, 147-uy",                     phone: "+998 (65) 220-05-79", email: "j.olot@sud.uz",          lat: 39.410517, lng: 63.816954 },
    { name: "Peshku tuman sudi",           address: "Peshku tumani, A.Temur ko'chasi, 5-uy",                  phone: "+998 (65) 220-06-16", email: "j.peshku@sud.uz",        lat: 40.042341, lng: 64.397416 },
    { name: "Romitan tuman sudi",          address: "Romitan shahar, A.Temur ko'chasi, 44-uy",                phone: "+998 (65) 220-05-81", email: "j.romitan@sud.uz",       lat: 39.935072, lng: 64.384823 },
    { name: "Shofirkon tuman sudi",        address: "Shofirkon tumani, Sultonobod ko'chasi, 3-uy",            phone: "+998 (65) 220-05-84", email: "j.shofirkon@sud.uz",     lat: 40.119275, lng: 64.505071 },
  ],
  navvil: [
    { name: "Navoiy viloyat sudi",           address: "Navoiy shahar, o'zbekiston ko'chasi, 11A-uy",       phone: "+998 (79) 222-01-24", email: "j.navoiy@sud.uz",      lat: 40.084929, lng: 65.373877 },
    { name: "Xatirchi tuman sudi",           address: "Xatirchi tuman, Pulkan ko'chasi, 60-uy",             phone: "+998 (79) 222-02-36", email: "j.xatirchi@sud.uz",    lat: 40.040723, lng: 65.957111 },
    { name: "Uchquduq tuman sudi",           address: "Uchquduq tuman, Navruz ko'chasi, 30-uy",             phone: "+998 (79) 222-01-12", email: "j.uchquduq@sud.uz",    lat: 42.149417, lng: 63.557894 },
    { name: "Tomdi tuman sudi",              address: "Tomdi tuman, Bazar Jirau ko'chasi, 4-uy",            phone: "+998 (79) 222-01-40", email: "j.tomdi@sud.uz",       lat: 41.718652, lng: 64.524573 },
    { name: "Nurota tuman sudi",             address: "Nurota tuman, X.Xudoyqulov ko'chasi, 49-uy",         phone: "+998 (79) 222-01-16", email: "j.nurota@sud.uz",      lat: 40.566477, lng: 65.697082 },
    { name: "Navoiy shahar sudi",            address: "Navoiy shahar, o'zbekiston ko'chasi, 14-uy",        phone: "+998 (79) 222-01-16", email: "j.navoiy.sh@sud.uz",   lat: 40.098224, lng: 65.375437 },
    { name: "Navbahor tuman sudi",           address: "Navbahor tuman, Boburshox ko'chasi, 4-uy",           phone: "+998 (79) 222-02-46", email: "j.navbahor@sud.uz",    lat: 40.222234, lng: 65.300352 },
    { name: "Qiziltepa tuman sudi",          address: "Qiziltepa tuman, o'zbekiston ko'chasi, 19-uy",       phone: "+998 (79) 222-02-45", email: "j.qiziltepa@sud.uz",   lat: 40.035793, lng: 65.845773 },
    { name: "Konimex tuman sudi",            address: "Konimex tuman, Bunyodkor ko'chasi, 19-uy",           phone: "+998 (79) 222-01-13", email: "j.konimex@sud.uz",     lat: 40.280379, lng: 65.138230 },
    { name: "Karmana tuman sudi",            address: "Karmana tuman, Temur malik ko'chasi, 16-uy",         phone: "+998 (79) 222-01-18", email: "j.karmana@sud.uz",     lat: 40.139046, lng: 65.360494 },
    { name: "Zarafshon shahar sudi",         address: "Zarafshon shahar, Marvarid ko'chasi, 1-uy",          phone: "+998 (79) 222-01-59", email: "j.zarafshon@sud.uz",   lat: 41.571460, lng: 64.202116 },
  ],
  xorvil: [
    { name: "Xorazm viloyat sudi",        address: "Urganch shahri, Tinchlik ko'chasi, 22-uy",                  phone: "+998 (62) 227-79-77", email: "j.xorazm@sud.uz",       lat: 41.562929, lng: 60.626336 },
    { name: "Urganch shahar sudi",      address: "Urganch shahri, Sheroziy ko'chasi, 14-uy",                   phone: "+998 (62) 227-77-61", email: "j.urganch@sud.uz",      lat: 41.555799, lng: 60.628598 },
    { name: "Urganch tuman sudi",       address: "Urganch tumani, Mustaqillik ko'chasi, 12/1-uy",             phone: "+998 (62) 227-77-63", email: "j.urganch.t@sud.uz",    lat: 41.5500, lng: 60.6200 },
    { name: "Xiva shahar sudi",         address: "Xiva shahar, A.Temur ko'chasi, 3-uy",                        phone: "+998 (62) 227-77-62", email: "j.xiva.sh@sud.uz",      lat: 41.441370, lng: 60.444467 },
    { name: "Xiva tuman sudi",          address: "Xiva tumani, A.Temur ko'chasi, 3-uy",                        phone: "+998 (62) 227-77-84", email: "j.xiva.t@sud.uz",       lat: 41.441370, lng: 60.444467 },
    { name: "Xonqa tuman sudi",         address: "Xonqa tumani, M.Abdullayev ko'chasi, 2-uy",                phone: "+998 (62) 227-77-68", email: "j.xonqa@sud.uz",        lat: 41.474373, lng: 60.782273 },
    { name: "Yangibozor tuman sudi",    address: "Yangibozor tumani, J.Manguberdiy ko'chasi, 46-uy",          phone: "+998 (62) 227-77-64", email: "j.yangibozor@sud.uz",   lat: 41.425963, lng: 60.312025 },
    { name: "Yangiariq tuman sudi",     address: "Yangiariq tumani, Urganch ko'chasi, 2-uy",                 phone: "+998 (62) 227-77-83", email: "j.yangiariq@sud.uz",    lat: 41.5000, lng: 60.3000 },
    { name: "Shovot tuman sudi",        address: "Shovot tumani, Turkiston ko'chasi, 77-uy",                  phone: "+998 (62) 227-77-82", email: "j.shovot@sud.uz",       lat: 41.679217, lng: 60.277548 },
    { name: "Xazorasp tuman sudi",      address: "Xazorasp tumani, Mustaqillik ko'chasi, 44-uy",             phone: "+998 (62) 227-77-65", email: "j.xazorasp@sud.uz",     lat: 41.3000, lng: 61.2000 },
    { name: "Qo'shko'pir tuman sudi",   address: "Qo'shko'pir tumani, Mustaqillik ko'chasi, raqamsiz uy",    phone: "+998 (62) 227-77-80", email: "j.qushkupir@sud.uz",    lat: 41.531064, lng: 60.349105 },
    { name: "Gurlan tuman sudi",        address: "Gurlan tumani, P.Mahmud ko'chasi, 26-uy",                    phone: "+998 (62) 227-77-81", email: "j.gurlan@sud.uz",       lat: 41.839683, lng: 60.397821 },
    { name: "Bog'ot tuman sudi",        address: "Bog'ot tumani, Baynalmilalchi ko'chasi, 1-uy",            phone: "+998 (62) 227-77-69", email: "j.bogot@sud.uz",        lat: 41.2000, lng: 60.5000 },
    { name: "Tuproqqal'a tuman sudi",   address: "Pitnaq shahar, Mustaqillik ko'chasi, 1-uy",                phone: "+998 (62) 227-77-60", email: "j.tuproqqala@sud.uz",   lat: 41.221703, lng: 61.311917 },
  ],
  qrvil: [
    { name: "Qoraqalpog'iston Respublikasi sudi",  address: "Nukus shahar, «Doslik guzari» MFY, I.Karimov ko'chasi, 122-uy",              phone: "+998 (55) 102-40-42", email: "j.qr@sud.uz",           lat: 42.469688, lng: 59.615159 },
    { name: "Ellikqal'a tuman sudi",               address: "Ellikqal'a tuman, Bo'ston shahri, Al-Beruniy ko'chasi, 10-uy",                phone: "+998 (55) 102-40-28", email: "j.ellikqala@sud.uz",    lat: 41.837919, lng: 60.909397 },
    { name: "Amudaryo tuman sudi",                 address: "Amudaryo tumani, Mang'it shahar, «Do'stlik» MFY, Gurlan ko'chasi, raqamsiz uy", phone: "+998 (55) 102-40-32", email: "j.amudaryo@sud.uz",    lat: 42.099996, lng: 60.080970 },
    { name: "Bo'zatov tuman sudi",                  address: "Bo'zatov tumani, A.Temur ko'chasi, 6-uy",                                     phone: "+998 (55) 102-40-58", email: "j.buzatov@sud.uz",     lat: 42.995119, lng: 59.347019 },
    { name: "Chimboy tuman sudi",                   address: "Chimboy tumani, Do'stlik guzari ko'chasi, raqamsiz uy",                      phone: "+998 (55) 102-40-54", email: "j.chimboy@sud.uz",     lat: 42.903102, lng: 59.777117 },
    { name: "Qonliko'l tuman sudi",                 address: "Qonlikul tuman, g'arezsilizlik ko'chasi, raqamsiz uy",                       phone: "+998 (55) 102-40-36", email: "j.qonlikul@sud.uz",    lat: 42.837675, lng: 59.006416 },
    { name: "Nukus shahar sudi",                    address: "Nukus shahar, E.Olakuz ko'chasi, 173/1-uy",                                  phone: "+998 (55) 102-40-25", email: "j.nukus@sud.uz",       lat: 42.469024, lng: 59.602524 },
    { name: "Qo'ng'irot tuman sudi",                address: "Qungirot tuman, Uzbekiston ko'chasi, 77 \"A\" uy",                           phone: "+998 (55) 102-40-38", email: "j.qungirot@sud.uz",   lat: 43.075700, lng: 58.900100 },
    { name: "Taxiatosh tuman sudi",                 address: "Taxiatosh tumani, Sh.Rashidov ko'chasi, 16-uy",                              phone: "+998 (55) 102-40-61", email: "j.taxiatosh@sud.uz",   lat: 42.336578, lng: 59.577676 },
    { name: "Qorao'zak tuman sudi",                 address: "Qorauzak tuman, G'arezsilik ko'chasi, raqamsiz uy",                          phone: "+998 (55) 102-40-56", email: "j.qorauzak@sud.uz",    lat: 43.028067, lng: 60.020751 },
    { name: "Shumanay tuman sudi",                  address: "Shumanay tuman, Xalqlar dustligi ko'chasi, raqamsiz uy",                    phone: "+998 (55) 102-40-39", email: "j.shumanay@sud.uz",    lat: 42.637838, lng: 58.938466 },
    { name: "Taxtako'pir tuman sudi",               address: "Taxtakupir tuman, Dustlik shox ko'chasi, raqamsiz uy",                        phone: "+998 (55) 102-40-57", email: "j.taxtakupir@sud.uz",  lat: 43.029390, lng: 60.273377 },
    { name: "Kegeyli tuman sudi",                   address: "Kegeyli tuman, Dustlik ko'chasi, raqamsiz uy",                              phone: "+998 (55) 102-40-52", email: "j.kegeyli@sud.uz",     lat: 42.777482, lng: 59.609608 },
    { name: "To'rtko'l tuman sudi",                 address: "Turtkul tuman, Turtkul ko'chasi, 62-uy",                                     phone: "+998 (55) 102-40-26", email: "j.turtkul@sud.uz",     lat: 41.552789, lng: 61.000160 },
    { name: "Beruniy tuman sudi",                   address: "Beruniy tuman, Beruniy shahri, Kat ko'chasi, raqamsiz-uy",                    phone: "+998 (55) 102-40-31", email: "j.beruniy@sud.uz",     lat: 41.681533, lng: 60.747528 },
    { name: "Nukus tuman sudi",                     address: "Nukus tuman, Darsan ko'chasi, 25-uy",                                        phone: "+998 (55) 102-40-51", email: "j.nukus.t@sud.uz",     lat: 42.595378, lng: 59.537909 },
    { name: "Xo'jayli tuman sudi",                  address: "Xujayli tuman, Dustlik ko'chasi, raqamsiz uy",                               phone: "+998 (55) 102-40-33", email: "j.xujayli@sud.uz",     lat: 42.411551, lng: 59.448964 },
    { name: "Mo'ynoq tuman sudi",                   address: "Muynoq tuman, Ajiniyaz ko'chasi, 72-uy",                                     phone: "+998 (55) 102-40-46", email: "j.muynoq@sud.uz",      lat: 43.769279, lng: 59.028815 },
  ],
  jizzvil: [
    { name: "Jizzax viloyat sudi",       address: "Jizzax shahri, Sayiljoyi ko'chasi, 63-uy",                        phone: "+998 (72) 152-05-70", email: "j.jizzah@sud.uz",      lat: 40.1156, lng: 67.8422 },
    { name: "Arnasoy tuman sudi",        address: "Arnasoy tumani, g'oliblar ShFY, Alpomish ko'chasi, 60-uy",       phone: "+998 (72) 152-06-75", email: "j.arnasoy@sud.uz",     lat: 40.1500, lng: 68.1500 },
    { name: "Baxmal tuman sudi",         address: "Baxmal tumani, o'smat shaharchasi, Mustaqillik ko'chasi, 1-uy",   phone: "+998 (72) 152-05-89", email: "j.baxmal@sud.uz",      lat: 40.2333, lng: 67.9167 },
    { name: "G'allaorol tuman sudi",     address: "g'allaorol tumani, Sarbozor qo'rgoni",                           phone: "+998 (72) 152-05-99", email: "j.gallaorol@sud.uz",   lat: 40.3458, lng: 67.5745 },
    { name: "Do'stlik tuman sudi",       address: "Do'stlik shaharchasi, Do'stlik ko'chasi, 15-uy",                  phone: "+998 (72) 152-05-61", email: "j.dustlik@sud.uz",     lat: 40.5167, lng: 68.0000 },
    { name: "Jizzax shahar sudi",        address: "Jizzax shahri, O.Azimov ko'chasi, 7-uy",                         phone: "+998 (72) 152-05-59", email: "j.jizzah.sh@sud.uz",   lat: 40.1156, lng: 67.8422 },
    { name: "Zarbdor tuman sudi",        address: "Zarbdor tumani, Mustaqillik shoh ko'chasi, raqamsiz uy",         phone: "+998 (72) 152-05-63", email: "j.zarbdor@sud.uz",     lat: 40.0500, lng: 67.7000 },
    { name: "Zafarobod tuman sudi",      address: "Zafarobod tumani, A.Navoy ko'chasi, 1-uy",                       phone: "+998 (72) 152-05-62", email: "j.zafarobod@sud.uz",   lat: 40.1500, lng: 68.6700 },
    { name: "Zomin tuman sudi",          address: "Zomin shahar, A.Sattarov ko'chasi, 1-uy",                        phone: "+998 (72) 152-05-79", email: "j.zomin@sud.uz",       lat: 40.0000, lng: 68.0000 },
    { name: "Mirzacho'l tuman sudi",     address: "Mirzacho'l tumani, Gagarin shahri, g'alaba MFY, Gagarin ko'chasi, 7-uy", phone: "+998 (72) 152-05-29", email: "j.mirzachul@sud.uz",   lat: 40.3500, lng: 68.3000 },
    { name: "Paxtakor tuman sudi",       address: "Paxtakor shahri, Y.Rajabiy ko'chasi, 1-uy",                      phone: "+998 (72) 152-05-64", email: "j.paxtakor@sud.uz",    lat: 40.3167, lng: 67.9500 },
    { name: "Forish tuman sudi",         address: "Forish tumani, Bog'don shaharchasi, Fayzobod ko'chasi",         phone: "+998 (72) 152-05-67", email: "j.forish@sud.uz",      lat: 40.4000, lng: 67.4000 },
    { name: "Sh.Rashidov tuman sudi",    address: "Sh.Rashidov tumani, Uchter daxasi, Paxtakor ko'chasi",            phone: "+998 (72) 152-05-19", email: "j.jizzah.t@sud.uz",    lat: 40.1800, lng: 67.6000 },
    { name: "Yangiobod tuman sudi",      address: "Yangiobod shaharchasi, Mustaqillik ko'chasi, 4-uy",              phone: "+998 (72) 152-06-23", email: "j.yangiobod@sud.uz",   lat: 40.2000, lng: 67.5000 },
  ],
  sirvil: [
    { name: "Sirdaryo viloyat sudi",      address: "Guliston shahar, Navoiy shox ko'chasi, 47-uy",                    phone: "+998 (67) 651-75-75", email: "j.sirdaryo@sud.uz",      lat: 40.4897, lng: 68.7869 },
    { name: "Boyovut tuman sudi",         address: "Boyovut tumani, Boyovut shahararchasi, Tinlik ko'chasi, 26-uy",  phone: "+998 (67) 651-35-45", email: "j.boyovut@sud.uz",       lat: 40.7167, lng: 68.1500 },
    { name: "Guliston tuman sudi",        address: "Guliston tumani, Dehqonobod shahararchasi, Turkiston ko'chasi, 26-uy", phone: "+998 (67) 651-35-44", email: "j.guliston.t@sud.uz",  lat: 40.4897, lng: 68.7869 },
    { name: "Mirzaobod tuman sudi",       address: "Mirzaobod tumani, Navro'z shahararchasi, Mustaqillik ko'chasi, 5-uy", phone: "+998 (67) 651-35-47", email: "j.mirzabod@sud.uz",    lat: 40.4500, lng: 68.7000 },
    { name: "Oqoltin tuman sudi",         address: "Oqoltin tumani, Sardoba shahararchasi, Islomobod ko'chasi, 7-uy", phone: "+998 (67) 651-35-46", email: "j.oqoltin@sud.uz",     lat: 40.4833, lng: 68.1833 },
    { name: "Sayhunobod tuman sudi",      address: "Sayhunobod tumani, Sayhun shahararchasi, Navoiy ko'chasi, 10-uy", phone: "+998 (67) 651-35-48", email: "j.sayxunobod@sud.uz",  lat: 40.4000, lng: 68.9000 },
    { name: "Sardoba tuman sudi",         address: "Sardoba tumani, Paxtaobod shahararchasi, Oyoq ko'chasi, 9-uy",   phone: "+998 (67) 651-35-56", email: "j.sardoba@sud.uz",     lat: 40.4833, lng: 68.1833 },
    { name: "Sirdaryo tuman sudi",        address: "Sirdaryo tumani, Sirdaryo shahri, o'zbekiston ko'chasi, 80-uy",   phone: "+998 (67) 651-35-34", email: "j.sirdaryo.t@sud.uz",  lat: 40.3667, lng: 68.8167 },
    { name: "Xovos tuman sudi",           address: "Hovos tumani, Bunyodkor mahallas, Samarqand ko'chasi",           phone: "+998 (67) 651-35-42", email: "j.xovos@sud.uz",       lat: 40.3667, lng: 68.8167 },
    { name: "Shirin shahar sudi",         address: "Shirin shahri, A.Temur ko'chasi, 12-uy",                         phone: "+998 (67) 651-35-43", email: "j.shirin@sud.uz",      lat: 40.6000, lng: 68.6500 },
    { name: "Yangiyer shahar sudi",       address: "Yangier shahri, Quruvchilar ko'chasi, 9-uy",                     phone: "+998 (67) 651-35-41", email: "j.yangiyer@sud.uz",    lat: 40.5000, lng: 68.7500 },
  ],
  kashvil: [
    { name: "Qashqadaryo viloyat sudi",    address: "Qarshi shahar, Nurbog' ko'chasi, 97-uy",                        phone: "+998 (75) 404-69-11", email: "j.qashqadaryo@sud.uz",    lat: 38.8610, lng: 65.7880 },
    { name: "Dehqonobod tuman sudi",       address: "Dehqonobod tuman, Qorashina shaharchasi, M.Ulug'bek ko'chasi, 3-uy", phone: "+998 (75) 404-69-21", email: "j.dexqonobod@sud.uz",     lat: 38.2000, lng: 66.3000 },
    { name: "G'uzor tuman sudi",           address: "g'uzor tuman, o'zbekiston ko'chasi, 72-uy",                     phone: "+998 (75) 404-69-18", email: "j.guzor@sud.uz",          lat: 38.6119, lng: 66.2644 },
    { name: "Kasbi tuman sudi",            address: "Kasbi tuman, Mug'lon shaharchasi",                             phone: "+998 (75) 404-69-23", email: "j.kasbi@sud.uz",          lat: 39.0000, lng: 65.8000 },
    { name: "Kitob tuman sudi",            address: "Kitob tuman, Katta yo'l ko'chasi",                             phone: "+998 (75) 404-69-24", email: "j.kitob@sud.uz",          lat: 39.1369, lng: 66.8886 },
    { name: "Koson tuman sudi",            address: "Koson tuman, Mustaqillik shoh ko'chasi",                       phone: "+998 (75) 404-69-25", email: "j.koson@sud.uz",          lat: 39.0000, lng: 66.8000 },
    { name: "Ko'kdala tuman sudi",         address: "Ko'kdala tuman, Ettitom shaharchasi, Nurafshon ko'chasi, 51-uy", phone: "+998 (75) 404-69-27", email: "j.kokdala@sud.uz",        lat: 38.9000, lng: 66.5000 },
    { name: "Qamashi tuman sudi",          address: "Qamashi tuman, Istiqlol ko'chasi, 47-uy",                      phone: "+998 (75) 404-69-20", email: "j.qamashi@sud.uz",        lat: 38.8494, lng: 65.9817 },
    { name: "Qarshi tuman sudi",           address: "Qarshi tuman, Beshket shahri, Mustaqillik ko'chasi, 18-uy",   phone: "+998 (75) 404-69-13", email: "j.qarshi.t@sud.uz",       lat: 38.8000, lng: 65.8000 },
    { name: "Qarshi shahar sudi",          address: "Qarshi shahar, Nurbog' ko'chasi, 41-uy",                       phone: "+998 (75) 404-69-12", email: "j.qarshi@sud.uz",         lat: 38.8610, lng: 65.7880 },
    { name: "Mirishkor tuman sudi",        address: "Mirishkor tuman, Yangi Mirishkor mahallasi, Mustaqillik ko'chasi, 14-uy", phone: "+998 (75) 404-69-28", email: "j.mirishkor@sud.uz",      lat: 38.8000, lng: 65.9000 },
    { name: "Muborak tuman sudi",          address: "Muborak tuman, Zanjirsoy shoh ko'chasi, 2/1-uy",               phone: "+998 (75) 404-69-29", email: "j.muborak@sud.uz",        lat: 39.2756, lng: 65.1533 },
    { name: "Nishon tuman sudi",           address: "Nishon tuman, Yangi Nishon shahri, o'zbekiston ko'chasi, 22-uy", phone: "+998 (75) 404-69-30", email: "j.nishon@sud.uz",         lat: 38.7000, lng: 65.5000 },
    { name: "Chiroqchi tuman sudi",        address: "Chiroqchi tuman, Mustaqillik ko'chasi, 7-uy",                 phone: "+998 (75) 404-69-31", email: "j.chiroqchi@sud.uz",      lat: 38.6000, lng: 66.2000 },
    { name: "Shahrisabz shahar sudi",      address: "Shahrisabz shahar, Ipak yo'li ko'chasi, 158-uy",               phone: "+998 (75) 404-69-16", email: "j.shaxrisabz@sud.uz",     lat: 39.0558, lng: 66.8350 },
    { name: "Shahrisabz tuman sudi",       address: "Shahrisabz shahar, Ipak yo'li ko'chasi, 158-uy",               phone: "+998 (75) 404-69-16", email: "j.shaxrisabz@sud.uz",     lat: 39.0558, lng: 66.8350 },
    { name: "Yakkabog' tuman sudi",        address: "Yakkabog' tuman, Sahovat ko'chasi, 1-uy",                    phone: "+998 (75) 404-69-32", email: "j.yakkabog@sud.uz",       lat: 38.9000, lng: 66.6000 },
  ],
  surxvil: [
    { name: "Surxondaryo viloyat sudi",      address: "Termiz shahri, Islom Karimov ko'chasi, 40-uy",                    phone: "+998 (76) 228-19-00", email: "j.surxondaryo@sud.uz",       lat: 37.2245, lng: 67.2783 },
    { name: "Termiz shahar sudi",            address: "Termiz shahar, Iso At Termiziy ko'chasi, 5-A uy",                 phone: "+998 (76) 228-19-01", email: "j.termiz@sud.uz",            lat: 37.2245, lng: 67.2783 },
    { name: "Sho'rchi tuman sudi",           address: "sho'rchi tuman, Mustaqillik ko`chasi, 115 uy",                     phone: "+998 (76) 228-19-14", email: "j.shurchi@sud.uz",           lat: 37.7956, lng: 67.0350 },
    { name: "Sherobod tuman sudi",           address: "Sherobod tumani, Mustaqillik ko'chasi, 14-uy",                    phone: "+998 (76) 228-19-13", email: "j.sherobod@sud.uz",          lat: 37.6289, lng: 67.0111 },
    { name: "Uzun tuman sudi",               address: "Uzun tumani, Yangiro'zg'or mahallasi",                             phone: "+998 (76) 228-19-12", email: "j.uzun@sud.uz",              lat: 37.4567, lng: 67.9833 },
    { name: "Termiz tuman sudi",             address: "Termiz tumani, At-Termiziy ko'chasi, 3-uy",                       phone: "+998 (76) 228-30-02", email: "j.termiz.t@sud.uz",          lat: 37.3000, lng: 67.3500 },
    { name: "Sariosiyo tuman sudi",          address: "Sariosiyo tumani, Mehr-shavqat ko'chasi",                           phone: "+998 (76) 228-19-11", email: "j.sariosiyo@sud.uz",         lat: 37.3833, lng: 67.5167 },
    { name: "Oltinsoy tuman sudi",           address: "Oltinsoy tumani, Bo'ston maxallasi",                                phone: "+998 (76) 228-19-10", email: "j.oltinsoy@sud.uz",          lat: 37.9833, lng: 67.5167 },
    { name: "Muzrabot tuman sudi",           address: "Muzrabot tumani, Quyoshkent ko'chasi, 2-uy",                      phone: "+998 (76) 228-19-09", email: "j.muzrabot@sud.uz",          lat: 37.7167, lng: 66.8500 },
    { name: "Qumqo'rg'on tuman sudi",       address: "Qumqo'rg'on tumani, o'zbekiston ko'chasi, 22-uy",                  phone: "+998 (76) 228-19-08", email: "j.qumqurgon@sud.uz",         lat: 37.7833, lng: 66.6000 },
    { name: "Qiziriq tuman sudi",            address: "Qiziriq tumani, Ibn Sino ko'chasi, 3-uy",                          phone: "+998 (76) 228-19-07", email: "j.qiziriq@sud.uz",           lat: 37.1167, lng: 67.4167 },
    { name: "Jarqo'rg'on tuman sudi",        address: "Jarqo'rg'on tumani, Y. Ohunboboyev ko'chasi, 1-uy",                phone: "+998 (76) 228-19-06", email: "j.jarqurgon@sud.uz",         lat: 37.5233, lng: 67.4142 },
    { name: "Denov tuman sudi",              address: "Denov tuman, Qo'zichoqli mahallasi, Eski bog' ko'chasi 111-uy",   phone: "+998 (76) 228-19-05", email: "j.denov@sud.uz",             lat: 38.2700, lng: 67.8858 },
    { name: "Boysun tuman sudi",             address: "Boysun tumani, Olmazor ko'chasi",                                   phone: "+998 (76) 228-19-04", email: "j.boysun@sud.uz",            lat: 38.2038, lng: 67.1892 },
    { name: "Bandixon tuman sudi",           address: "Bandixon tumani, Bandixon maxallasi, Guliston kuchasi, 4-uy",      phone: "+998 (76) 228-19-15", email: "j.bandixon@sud.uz",          lat: 37.4000, lng: 67.7833 },
    { name: "Angor tuman sudi",              address: "Angor tumani, At-Termiziy ko'chasi, 1-uy",                         phone: "+998 (76) 228-19-03", email: "j.angor@sud.uz",             lat: 37.4167, lng: 67.1833 },
  ],
};

// ── Fuqarolik ishlar bo'yicha tumanlararo sudlar ──────────────────────────────
const FUQ: Record<string, CourtEntry[]> = {
  andvil: [
    { name: "Andijon viloyat sudi",          address: "Andijon shahar, Alisher Navoiy shoh ko'chasi, 15-uy",              phone: "+998 (74) 224-42-44", email: "f.andijon@sud.uz",      jadval: "jadval2.sud.uz" },
    { name: "Andijon tumanlararo sudi",      address: "Andijon tumani, Toshkent ko'chasi, 4-uy",                         phone: "+998 (74) 224-37-17", email: "f.andijon.t@sud.uz",    jadval: "jadval2.sud.uz" },
    { name: "Asaka tumanlararo sudi",        address: "Asaka tumani, Ergashobod MFY, Ergashobod ko'chasi, 37-uy",        phone: "+998 (74) 224-37-27", email: "f.asaka@sud.uz",        jadval: "jadval2.sud.uz" },
    { name: "Bo'ston tumanlararo sudi",      address: "Bo'ston tumani, Pilla kor MFY, Mustaqillik ko'chasi, 32-uy",       phone: "+998 (74) 224-37-47", email: "f.buz@sud.uz",          jadval: "jadval2.sud.uz" },
    { name: "Izboskan tumanlararo sudi",     address: "Izboskan tumani, Po'ytug' shahri, Mirzo Ulug'bek ko'chasi, 2-uy", phone: "+998 (74) 224-37-57", email: "f.izboskan@sud.uz",     jadval: "jadval2.sud.uz" },
    { name: "Qo'rg'ontepa tumanlararo sudi", address: "Qo'rg'ontepa shahri, Mustaqillik ko'chasi, 50 \u00ab\u0430\u00bb-uy", phone: "+998 (74) 224-37-67", email: "f.qurgontepa@sud.uz",   jadval: "jadval2.sud.uz" },
    { name: "Xo'jaobod tumanlararo sudi",    address: "Xo'jaobod tumani, Anxor ko'chasi, 2-uy",                         phone: "+998 (74) 224-37-87", email: "f.xujaobod@sud.uz",     jadval: "jadval2.sud.uz" },
  ],
};

// ── Ma'muriy sudlar ───────────────────────────────────────────────────────────
const MAM: Record<string, CourtEntry[]> = {
  tashsh: [
    { name: "Toshkent shahar ma'muriy sudi",           address: "100029, Toshkent sh., Mirabad tumani, Amir Temur shoh., 5",   phone: "+998 (71) 233-54-32", email: "tashsh.mam@supcourt.uz",  lat: 41.2995, lng: 69.2758 },
    { name: "Toshkent shahar tumanlararo ma'muriy sudi №1", address: "100015, Toshkent sh., Chilonzor tumani, Bunyodkor, 1",  phone: "+998 (71) 277-65-43", email: "tashsh.mam1@supcourt.uz", lat: 41.2874, lng: 69.2050 },
    { name: "Toshkent shahar tumanlararo ma'muriy sudi №2", address: "100100, Toshkent sh., Yunusobod tumani, Amir Temur, 100",phone: "+998 (71) 264-76-54", email: "tashsh.mam2@supcourt.uz", lat: 41.3494, lng: 69.2983 },
  ],
  tashvil: [
    { name: "Toshkent viloyati ma'muriy sudi",     address: "111200, Toshkent vil., Nurafshon sh., Mustaqillik, 1",    phone: "+998 (70) 745-23-45", email: "tashvil.mam@supcourt.uz",  lat: 40.7456, lng: 69.3455 },
    { name: "Bekabad tumanlararo ma'muriy sudi",   address: "110700, Toshkent vil., Bekabad sh., Navruz ko'ch., 7",   phone: "+998 (70) 742-34-56", email: "bekabad.mam@supcourt.uz",  lat: 40.2228, lng: 69.2756 },
  ],
  andvil: [
    { name: "Andijon viloyati ma'muriy sudi",   address: "170100, Andijon shahar, Mustaqillik ko'ch., 10",         phone: "+998 (74) 223-45-67", email: "andvil.mam@supcourt.uz", lat: 40.7829, lng: 72.3440 },
    { name: "Asaka tumanlararo ma'muriy sudi",  address: "170500, Andijon vil., Asaka sh., Istiqlol ko'ch., 3",   phone: "+998 (74) 254-56-78", email: "asaka.mam@supcourt.uz",  lat: 40.6343, lng: 72.2451 },
  ],
  farvil: [
    { name: "Farg'ona viloyati ma'muriy sudi",  address: "150100, Farg'ona shahar, Mustaqillik ko'ch., 20",         phone: "+998 (73) 244-56-78", email: "farvil.mam@supcourt.uz", lat: 40.3840, lng: 71.7870 },
    { name: "Qo'qon tumanlararo ma'muriy sudi", address: "150700, Farg'ona vil., Qo'qon sh., Istiqlol ko'ch., 18", phone: "+998 (73) 552-67-89", email: "qoqon.mam@supcourt.uz",  lat: 40.5289, lng: 70.9427 },
  ],
  namvil: [
    { name: "Namangan viloyati ma'muriy sudi", address: "160100, Namangan shahar, Hamza ko'ch., 40", phone: "+998 (69) 234-67-89", email: "namvil.mam@supcourt.uz", lat: 41.0011, lng: 71.6724 },
  ],
  samvil: [
    { name: "Samarqand viloyati ma'muriy sudi",     address: "140100, Samarqand shahar, Registon ko'ch., 6",              phone: "+998 (66) 233-78-90", email: "samvil.mam@supcourt.uz",       lat: 39.6542, lng: 66.9597 },
    { name: "Kattaqo'rg'on tumanlararo ma'muriy sudi", address: "140800, Samarqand vil., Kattaqo'rg'on sh., Navruz, 4", phone: "+998 (66) 491-89-01", email: "kattaqorgon.mam@supcourt.uz", lat: 39.9006, lng: 66.2594 },
  ],
  buhvil: [
    { name: "Buxoro viloyati ma'muriy sudi", address: "200100, Buxoro shahar, Al-Xorazmiy ko'ch., 4", phone: "+998 (65) 223-89-01", email: "buhvil.mam@supcourt.uz", lat: 39.7748, lng: 64.4286 },
  ],
  navvil: [
    { name: "Navoiy viloyati ma'muriy sudi", address: "210100, Navoiy shahar, Navoiy ko'ch., 1", phone: "+998 (79) 223-90-12", email: "navvil.mam@supcourt.uz", lat: 40.0840, lng: 65.3791 },
  ],
  xorvil: [
    { name: "Xorazm viloyati ma'muriy sudi", address: "220100, Urganch shahar, Al-Xorazmiy ko'ch., 10", phone: "+998 (62) 226-01-23", email: "xorvil.mam@supcourt.uz", lat: 41.5553, lng: 60.6333 },
  ],
  qrvil: [
    { name: "Qoraqalpog'iston Respublikasi ma'muriy sudi", address: "230100, Nukus shahar, Qoraqalpog'iston ko'ch., 15", phone: "+998 (61) 222-12-34", email: "qrvil.mam@supcourt.uz",  lat: 42.4600, lng: 59.6166 },
    { name: "Beruniy tumanlararo ma'muriy sudi",           address: "230500, QR, Beruniy shahar, Istiqlol ko'ch., 5",    phone: "+998 (61) 241-23-45", email: "beruni.mam@supcourt.uz",   lat: 41.6945, lng: 60.7476 },
  ],
  jizzvil: [
    { name: "Jizzax viloyati ma'muriy sudi", address: "130100, Jizzax shahar, Sharof Rashidov ko'ch., 10", phone: "+998 (72) 226-23-45", email: "jizzvil.mam@supcourt.uz", lat: 40.1156, lng: 67.8422 },
  ],
  sirvil: [
    { name: "Sirdaryo viloyati ma'muriy sudi", address: "120100, Guliston shahar, Mustaqillik ko'ch., 20", phone: "+998 (67) 223-34-56", email: "sirvil.mam@supcourt.uz", lat: 40.4897, lng: 68.7869 },
  ],
  kashvil: [
    { name: "Qashqadaryo viloyati ma'muriy sudi",     address: "180100, Qarshi shahar, Amir Temur ko'ch., 38",        phone: "+998 (75) 225-45-67", email: "kashvil.mam@supcourt.uz",      lat: 38.8610, lng: 65.7880 },
    { name: "Shahrisabz tumanlararo ma'muriy sudi",   address: "180700, Qashqadaryo vil., Shahrisabz sh., Temur, 3",  phone: "+998 (75) 255-56-78", email: "shahrisabz.mam@supcourt.uz",   lat: 39.0558, lng: 66.8350 },
  ],
  surxvil: [
    { name: "Surxondaryo viloyati ma'muriy sudi", address: "190100, Termiz shahar, Al-Termiziy ko'ch., 1", phone: "+998 (76) 225-56-78", email: "surxvil.mam@supcourt.uz", lat: 37.2245, lng: 67.2783 },
  ],
};

// ── Iqtisodiy sudlar (bir viloyat — bir sud) ──────────────────────────────────
const IQT: Record<string, CourtEntry[]> = {
  tashsh:  [{ name: "Toshkent shahar iqtisodiy sudi",              address: "100047, Toshkent sh., Chilonzor tumani, A.Ikromov ko'ch., 3", phone: "+998 (71) 233-60-80", email: "tashsh.iqt@supcourt.uz",  lat: 41.2993, lng: 69.2395 }],
  tashvil: [{ name: "Toshkent viloyati iqtisodiy sudi",            address: "111200, Toshkent vil., Nurafshon sh., Mustaqillik, 3",         phone: "+998 (70) 745-71-82", email: "tashvil.iqt@supcourt.uz", lat: 40.7456, lng: 69.3455 }],
  andvil:  [{ name: "Andijon viloyati iqtisodiy sudi",             address: "170100, Andijon shahar, Navruz ko'ch., 12",                    phone: "+998 (74) 223-82-93", email: "andvil.iqt@supcourt.uz",  lat: 40.7829, lng: 72.3440 }],
  farvil:  [{ name: "Farg'ona viloyati iqtisodiy sudi",            address: "150100, Farg'ona shahar, Mustaqillik ko'ch., 15",              phone: "+998 (73) 244-93-04", email: "farvil.iqt@supcourt.uz",  lat: 40.3840, lng: 71.7870 }],
  namvil:  [{ name: "Namangan viloyati iqtisodiy sudi",            address: "160100, Namangan shahar, Hamza ko'ch., 36",                    phone: "+998 (69) 234-04-15", email: "namvil.iqt@supcourt.uz",  lat: 41.0011, lng: 71.6724 }],
  samvil:  [{ name: "Samarqand viloyati iqtisodiy sudi",           address: "140100, Samarqand shahar, Registon ko'ch., 8",                 phone: "+998 (66) 233-15-26", email: "samvil.iqt@supcourt.uz",  lat: 39.6542, lng: 66.9597 }],
  buhvil:  [{ name: "Buxoro viloyati iqtisodiy sudi",              address: "200100, Buxoro shahar, Al-Xorazmiy ko'ch., 6",                 phone: "+998 (65) 223-26-37", email: "buhvil.iqt@supcourt.uz",  lat: 39.7748, lng: 64.4286 }],
  navvil:  [{ name: "Navoiy viloyati iqtisodiy sudi",              address: "210100, Navoiy shahar, Navoiy ko'ch., 5",                      phone: "+998 (79) 223-37-48", email: "navvil.iqt@supcourt.uz",  lat: 40.0840, lng: 65.3791 }],
  xorvil:  [{ name: "Xorazm viloyati iqtisodiy sudi",              address: "220100, Urganch shahar, Al-Xorazmiy ko'ch., 12",               phone: "+998 (62) 226-48-59", email: "xorvil.iqt@supcourt.uz",  lat: 41.5553, lng: 60.6333 }],
  qrvil:   [{ name: "Qoraqalpog'iston Respublikasi iqtisodiy sudi",address: "230100, Nukus shahar, Qoraqalpog'iston ko'ch., 18",            phone: "+998 (61) 222-59-70", email: "qrvil.iqt@supcourt.uz",   lat: 42.4600, lng: 59.6166 }],
  jizzvil: [{ name: "Jizzax viloyati iqtisodiy sudi",              address: "130100, Jizzax shahar, Sharof Rashidov ko'ch., 12",            phone: "+998 (72) 226-70-81", email: "jizzvil.iqt@supcourt.uz", lat: 40.1156, lng: 67.8422 }],
  sirvil:  [{ name: "Sirdaryo viloyati iqtisodiy sudi",            address: "120100, Guliston shahar, Mustaqillik ko'ch., 24",              phone: "+998 (67) 223-81-92", email: "sirvil.iqt@supcourt.uz",  lat: 40.4897, lng: 68.7869 }],
  kashvil: [{ name: "Qashqadaryo viloyati iqtisodiy sudi",         address: "180100, Qarshi shahar, Amir Temur ko'ch., 40",                 phone: "+998 (75) 225-92-03", email: "kashvil.iqt@supcourt.uz", lat: 38.8610, lng: 65.7880 }],
  surxvil: [{ name: "Surxondaryo viloyati iqtisodiy sudi",         address: "190100, Termiz shahar, Al-Termiziy ko'ch., 3",                 phone: "+998 (76) 225-03-14", email: "surxvil.iqt@supcourt.uz", lat: 37.2245, lng: 67.2783 }],
};

// ── Yagona kirish nuqtasi ─────────────────────────────────────────────────────
export function getCourts(type: CourtType, regionId: string): CourtEntry[] {
  // Fuqarolik ishlari tumanlararo sudlari jinoyat sudlari bilan bitta
  const map: Record<CourtType, Record<string, CourtEntry[]>> = {
    jin: JIN,
    fuq: FUQ,
    mam: MAM,
    iqt: IQT,
  };
  return map[type]?.[regionId] ?? [];
}
