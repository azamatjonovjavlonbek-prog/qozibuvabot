import type { Lang } from "./userProfile";

const S: Record<string, Record<Lang, string>> = {
  welcome_lang: {
    latin:    "Assalomu alaykum!\n\nIltimos, qulay tilni tanlang:",
    cyrillic: "Ассалому алайкум!\n\nИлтимос, қулай тилни танланг:",
  },
  phone_request: {
    latin:    "📱 *Telefon raqamingizni yuboring.*\n\nQuyidagi tugmani bosib avtomatik ulashishingiz yoki qo'lda yozishingiz mumkin:",
    cyrillic: "📱 *Телефон рақамингизни юборинг.*\n\nҚуйидаги тугмани босиб автоматик улашишингиз ёки қўлда ёзишингиз мумкин:",
  },
  phone_share_btn: {
    latin:    "📱 Telefon raqamni ulashish",
    cyrillic: "📱 Телефон рақамни улашиш",
  },
  phone_saved: {
    latin:    "✅ Raqamingiz saqlandi! Xush kelibsiz.\n\nQuyidagi xizmatlardan birini tanlang:",
    cyrillic: "✅ Рақамингиз сақланди! Хуш келибсиз.\n\nҚуйидаги хизматлардан бирини танланг:",
  },
  main_menu: {
    latin:    "🏠 *Bosh menyu*\n\nQuyidagi xizmatlardan birini tanlang:",
    cyrillic: "🏠 *Бош меню*\n\nҚуйидаги хизматлардан бирини танланг:",
  },
  btn_ariza: {
    latin:    "Ariza bo'limi",
    cyrillic: "Ариза бўлими",
  },
  btn_consultation: {
    latin:    "Konsultatsiya",
    cyrillic: "Консультация",
  },
  btn_ai: {
    latin:    "Qozibuva AI ⚖️",
    cyrillic: "Қозибува AI ⚖️",
  },
  btn_about: {
    latin:    "Biz haqimizda",
    cyrillic: "Биз ҳақимизда",
  },
  btn_courts: {
    latin:    "Sudlar manzillari",
    cyrillic: "Судлар манзиллари",
  },
  btn_aliment: {
    latin:    "Aliment kalkulyatori",
    cyrillic: "Алимент калькулятори",
  },
  btn_clear: {
    latin:    "Chatni tozalash",
    cyrillic: "Чатни тозалаш",
  },
  btn_tahlil: {
    latin:    "Hujjat tahlili (AI)",
    cyrillic: "Хужжат таҳлили (AI)",
  },
  tahlil_intro: {
    latin:    "📄 *Hujjat tahlili*\n\nShartnoma, ariza yoki boshqa huquqiy hujjatingizni yuklang — AI O'zbekiston qonunchiligiga asoslanib tahlil qiladi.\n\n*Qo'llab-quvvatlanadigan format:*\n— PDF fayl\n— Word hujjat (DOCX)\n— Rasm (JPEG/PNG)\n\nHujjatni yuboring:",
    cyrillic: "📄 *Хужжат таҳлили*\n\nШартнома, ариза ёки бошқа ҳуқуқий ҳужжатингизни юкланг — AI Ўзбекистон қонунчилигига асосланиб таҳлил қилади.\n\n*Қўллаб-қувватланадиган формат:*\n— PDF файл\n— Word ҳужжат (DOCX)\n— Расм (JPEG/PNG)\n\nҲужжатни юборинг:",
  },
  tahlil_processing: {
    latin:    "⏳ Hujjat tahlil qilinmoqda... Biroz kuting.",
    cyrillic: "⏳ Ҳужжат таҳлил қилинмоқда... Бироз кутинг.",
  },
  tahlil_unsupported: {
    latin:    "⚠️ Faqat PDF fayl yoki rasm (JPEG/PNG) yuboring.",
    cyrillic: "⚠️ Фақат PDF файл ёки расм (JPEG/PNG) юборинг.",
  },
  tahlil_error: {
    latin:    "❌ Tahlil qilishda xatolik yuz berdi. Qaytadan urinib ko'ring.",
    cyrillic: "❌ Таҳлил қилишда хатолик юз берди. Қайтадан уриниб кўринг.",
  },
  tahlil_disclaimer: {
    latin:    "_⚠️ Diqqat: Ushbu tahlil sun'iy intellekt tomonidan tayyorlangan bo'lib, faqat tavsiyaviy xususiyatga ega. Yuridik ahamiyatga ega qarorlar qabul qilishdan oldin malakali yurist bilan maslahatlashing._",
    cyrillic: "_⚠️ Диққат: Ушбу таҳлил сунъий интеллект томонидан тайёрланган бўлиб, фақат тавсиявий хусусиятга эга. Юридик аҳамиятга эга қарорлар қабул қилишдан олдин малакали юрист билан маслаҳатлашинг._",
  },
  btn_back: {
    latin:    "🔙 Orqaga",
    cyrillic: "🔙 Орқага",
  },
  btn_main: {
    latin:    "🏠 Bosh menyu",
    cyrillic: "🏠 Бош меню",
  },
  btn_cancel: {
    latin:    "❌ Bekor qilish",
    cyrillic: "❌ Бекор қилиш",
  },
  btn_shablon_menu: {
    latin:    "Shablon ariza",
    cyrillic: "Шаблон ариза",
  },
  btn_professional_menu: {
    latin:    "Professional ariza",
    cyrillic: "Профессионал ариза",
  },
  btn_order: {
    latin:    "💳 Buyurtma berish",
    cyrillic: "💳 Буюртма бериш",
  },
  btn_write_msg: {
    latin:    "Xabar yozish",
    cyrillic: "Хабар ёзиш",
  },
  ariza_menu: {
    latin:    "📄 *Ariza bo'limi*\n\nQuyidagi ikki xizmatdan birini tanlang:\n\n*Shablon ariza* — tayyor shablon, ba'zi ma'lumotlarni o'zingiz to'ldirasiz.\n*Professional ariza* — yurist tomonidan to'liq yozib beriladi.",
    cyrillic: "📄 *Ариза бўлими*\n\nҚуйидаги икки хизматдан бирини танланг:\n\n*Шаблон ариза* — тайёр шаблон, баъзи маълумотларни ўзингиз тўлдирасиз.\n*Профессионал ариза* — юрист томонидан тўлиқ ёзиб берилади.",
  },
  send_check_prompt: {
    latin:    "Iltimos, to'lov chekini *rasm yoki fayl* sifatida yuboring.",
    cyrillic: "Илтимос, тўлов чекини *расм ёки файл* сифатида юборинг.",
  },
  check_sent: {
    latin:    "⏳ *Chekingiz administratorga yuborildi!*\n\nTasdiqlangach, xizmat darhol yuboriladi. Odatda *5–10 daqiqa* ichida.",
    cyrillic: "⏳ *Чекингиз администраторга юборилди!*\n\nТасдиқлангач, хизмат дарҳол юборилади. Одатда *5–10 дақиқа* ичида.",
  },
  error_try_again: {
    latin:    "⚠️ Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.",
    cyrillic: "⚠️ Хатолик юз берди. Илтимос қайтадан уриниб кўринг.",
  },
  payment_rejected: {
    latin:    "❌ *To'lovingiz tasdiqlanmadi.*\n\nIltimos, to'g'ri karta raqamiga o'tkazganingizni tekshirib, chekni qayta yuboring.",
    cyrillic: "❌ *Тўловингиз тасдиқланмади.*\n\nИлтимос, тўғри карта рақамига ўтказганингизни текшириб, чекни қайта юборинг.",
  },
  pro_approved_msg: {
    latin:    "✅ *To'lovingiz tasdiqlandi!*\n\nProfessional ariza buyurtmangiz qabul qilindi.\n\nYuristimiz tez orada siz bilan bog'lanib, kerakli ma'lumotlarni so'raydi. Iltimos, kutib turing.",
    cyrillic: "✅ *Тўловингиз тасдиқланди!*\n\nПрофессионал ариза буюртмангиз қабул қилинди.\n\nЮристимиз тез орада сиз билан боғланиб, керакли маълумотларни сўрайди. Илтимос, кутиб туринг.",
  },
  pro_ariza_ready: {
    latin:    "✍️ *Professional ariza tayyor!*\n\nYuristimiz tomonidan yozilgan arizangiz yuborildi. Kerakli joylarni to'ldirib, imzolab sudga topshiring.",
    cyrillic: "✍️ *Профессионал ариза тайёр!*\n\nЮристимиз томонидан ёзилган аризангиз юборилди. Керакли жойларни тўлдириб, имзолаб судга топширинг.",
  },
  doc_caption: {
    latin:    "📄 Bo'sh joylarni yoki sariq bilan belgilangan joylarni o'zingizga moslab to'ldirib, imzolab sudga topshiring.",
    cyrillic: "📄 Бўш жойларни ёки сариқ билан белгиланган жойларни ўзингизга мослаб тўлдириб, имзолаб судга топширинг.",
  },
};

export function t(lang: Lang, key: string): string {
  return S[key]?.[lang] ?? S[key]?.latin ?? key;
}

export function tMenuHeader(lang: Lang, count: number): string {
  return lang === "cyrillic"
    ? `🏠 *Бош меню*\n\n👥 Жами фойдаланувчилар: *${count} нафар*\n\nҚуйидаги хизматлардан бирини танланг:`
    : `🏠 *Bosh menyu*\n\n👥 Jami foydalanuvchilar: *${count} nafar*\n\nQuyidagi xizmatlardan birini tanlang:`;
}

export function tMainMenu(lang: Lang, shablon: string, professional: string, consultation: string, card: string, owner: string, hours: string): string {
  return lang === "cyrillic"
    ? `ℹ️ *QoziBuva Ҳуқуқий Хизматлар*\n\nБиз Ўзбекистон фуқароларига тез ва сифатли ҳуқуқий ёрдам кўрсатамиз.\n\n*Хизматлар:*\nШаблон ариза — *${shablon}*\nПрофессионал ариза — *${professional}*\nКонсультация — *${consultation}*\n\n*Тўлов:*\nКарта: \`${card}\`\nЭгаси: *${owner}*\n\nИш вақти: ${hours}\n\nҲуқуқий савол учун "Qozibuva AI ⚖️" тугмасини босинг.`
    : `ℹ️ *QoziBuva Huquqiy Xizmatlar*\n\nBiz O'zbekiston fuqarolariga tez va sifatli huquqiy yordam ko'rsatamiz.\n\n*Xizmatlar:*\nShablon ariza — *${shablon}*\nProfessional ariza — *${professional}*\nKonsultatsiya — *${consultation}*\n\n*To'lov:*\nKarta: \`${card}\`\nEgasi: *${owner}*\n\nIsh vaqti: ${hours}\n\nHuquqiy savol uchun "Qozibuva AI ⚖️" tugmasini bosing.`;
}

export function tShablonList(lang: Lang, price: string): string {
  return lang === "cyrillic"
    ? `📝 *Шаблон ариза*\n\nНархи: *${price}*\n\nТайёр шаблон файлингиз юборилади. Ундаги бўш жойларни ўзингиз тўлдирасиз.\n\nҚайси мавзу бўйича ариза керак?`
    : `📝 *Shablon ariza*\n\nNarxi: *${price}*\n\nTayyor shablon faylingiz yuboriladi. Undagi bo'sh joylarni o'zingiz to'ldirasiz.\n\nQaysi mavzu bo'yicha ariza kerak?`;
}

export function tShablonConfirm(lang: Lang, label: string, price: string): string {
  return lang === "cyrillic"
    ? `📝 *${label} — Шаблон ариза*\n\nТайёр шаблон файлини оласиз ва ундаги бўш жойларни ўзингиз тўлдирасиз.\n\nНархи: *${price}*`
    : `📝 *${label} — Shablon ariza*\n\nTayyor shablon faylini olasiz va undagi bo'sh joylarni o'zingiz to'ldirasiz.\n\nNarxi: *${price}*`;
}

export function tPayShablon(lang: Lang, label: string, price: string, card: string, owner: string): string {
  return lang === "cyrillic"
    ? `💳 *Тўлов маълумотлари*\n\nХизмат: *${label} (Шаблон)*\nСумма: *${price}*\n\nКарта рақами:\n\`${card}\`\nКарта эгаси: *${owner}*\n\nТўлов қилгандан сўнг *тўлов чеки (screenshot)* расмини шу чатга юборинг.`
    : `💳 *To'lov ma'lumotlari*\n\nXizmat: *${label} (Shablon)*\nSumma: *${price}*\n\nKarta raqami:\n\`${card}\`\nKarta egasi: *${owner}*\n\nTo'lov qilgandan so'ng *to'lov cheki (screenshot)* rasmini shu chatga yuboring.`;
}

export function tProfessional(lang: Lang, price: string): string {
  return lang === "cyrillic"
    ? `✍️ *Профессионал ариза*\n\nЮристимиз сизнинг ҳолатингизга мос ариза ёзиб беради.\n\nНархи: *${price}*\n\nБуюртма берганда сўнг юристимиз сиз билан боғланиб, керакли маълумотларни сўрайди ва тайёр аризани бот орқали юборади.`
    : `✍️ *Professional ariza*\n\nYuristimiz sizning holatIngizga mos ariza yozib beradi.\n\nNarxi: *${price}*\n\nBuyurtma bergandan so'ng yuristimiz siz bilan bog'lanib, kerakli ma'lumotlarni so'raydi va tayyor arizani bot orqali yuboradi.`;
}

export function tPayProfessional(lang: Lang, price: string, card: string, owner: string): string {
  return lang === "cyrillic"
    ? `💳 *Тўлов маълумотлари*\n\nХизмат: *Профессионал ариза*\nНархи: *${price}*\n\nКарта рақами:\n\`${card}\`\nКарта эгаси: *${owner}*\n\nТўлов қилгандан сўнг *тўлов чеки (screenshot)* расмини шу чатга юборинг.\n\nЮристимиз тўлов тасдиқлангач нархни аниқлаштиради.`
    : `💳 *To'lov ma'lumotlari*\n\nXizmat: *Professional ariza*\nNarxi: *${price}*\n\nKarta raqami:\n\`${card}\`\nKarta egasi: *${owner}*\n\nTo'lov qilgandan so'ng *to'lov cheki (screenshot)* rasmini shu chatga yuboring.\n\nYuristimiz to'lov tasdiqlangach narxni aniqlashtiradi.`;
}

export function tConsultation(lang: Lang, price: string, hours: string): string {
  return lang === "cyrillic"
    ? `📞 *Консультация хизмати*\n\nҲуқуқий масалаларингиз бўйича мутахассисимиз билан боғланинг.\n\nНархи: *${price}*\nИш вақти: *${hours}*\n\nТўловдан сўнг телефон рақамимиз юборилади.`
    : `📞 *Konsultatsiya xizmati*\n\nHuquqiy masalalaringiz bo'yicha mutaxassisimiz bilan bog'laning.\n\nNarxi: *${price}*\nIsh vaqti: *${hours}*\n\nTo'lovdan so'ng telefon raqamimiz yuboriladi.`;
}

export function tPayConsultation(lang: Lang, price: string, card: string, owner: string): string {
  return lang === "cyrillic"
    ? `💳 *Тўлов маълумотлари*\n\nХизмат: *Консультация*\nСумма: *${price}*\n\nКарта рақами:\n\`${card}\`\nКарта эгаси: *${owner}*\n\nТўлов қилгандан сўнг *тўлов чеки (screenshot)* расмини шу чатга юборинг.`
    : `💳 *To'lov ma'lumotlari*\n\nXizmat: *Konsultatsiya*\nSumma: *${price}*\n\nKarta raqami:\n\`${card}\`\nKarta egasi: *${owner}*\n\nTo'lov qilgandan so'ng *to'lov cheki (screenshot)* rasmini shu chatga yuboring.`;
}

export function tApprovedShablon(lang: Lang, label: string): string {
  return lang === "cyrillic"
    ? `✅ *Тўловингиз тасдиқланди!*\n\n*${label}* шаблон аризаси қуйида юборилмоқда...`
    : `✅ *To'lovingiz tasdiqlandi!*\n\n*${label}* shablon arizasi quyida yuborilmoqda...`;
}

export function tApprovedConsultation(lang: Lang, phone: string, hours: string): string {
  return lang === "cyrillic"
    ? `✅ *Тўловингиз тасдиқланди!*\n\nМутахассисимиз билан боғланинг:\n\nТелефон: *${phone}*\nИш вақти: *${hours}*\n\nКўрсатилган вақт оралиғида қўнғироқ қилинг.`
    : `✅ *To'lovingiz tasdiqlandi!*\n\nMutaxassisimiz bilan bog'laning:\n\nTelefon: *${phone}*\nIsh vaqti: *${hours}*\n\nKo'rsatilgan vaqt oralig'ida qo'ng'iroq qiling.`;
}

export function tCatLabel(lang: Lang, latinLabel: string): string {
  if (lang !== "cyrillic") return latinLabel;
  const map: Record<string, string> = {
    "Nikohdan ajratish":         "Никоҳдан ажратиш",
    "Aliment undirish":          "Алимент ундириш",
    "Multiradar jarima bekor qilish": "Мултирадар жарима бекор қилиш",
  };
  return map[latinLabel] ?? latinLabel;
}

export function tProPrice(lang: Lang): string {
  return lang === "cyrillic"
    ? "199 000 сўмдан 1 000 000 сўмгача"
    : "199 000 so'mdan 1 000 000 so'mgacha";
}

export function tHours(lang: Lang): string {
  return lang === "cyrillic"
    ? "10:00 дан 20:00 гача"
    : "10:00 dan 20:00 gacha";
}

export function tSom(lang: Lang): string {
  return lang === "cyrillic" ? "сўм" : "so'm";
}

export function tHelp(lang: Lang, shablon: string, professional: string, consultation: string): string {
  return lang === "cyrillic"
    ? `ℹ️ *QoziBuva Ҳуқуқий Хизматлар*\n\n*Хизматлар:*\n*Шаблон ариза* — ${shablon}\n   Тайёр Word шаблон файлини оласиз\n\n*Профессионал ариза* — ${professional}\n   Юрист сизнинг ҳолатингизга мос ариза ёзиб беради\n\n*Консультация* — ${consultation}\n   Телефон орқали ҳуқуқий маслаҳат\n\n*Qozibuva AI ⚖️* — 3 та бепул\n   Ўзбекистон қонунчилиги бўйича AI маслаҳат\n\n*Қандай ишлайди?*\n1. Хизматни танланг\n2. Карта рақамига тўлов қилинг\n3. Тўлов чеки (screenshot) юборинг\n4. Админ тасдиқлайди → хизмат юборилади`
    : `ℹ️ *QoziBuva Huquqiy Xizmatlar*\n\n*Xizmatlar:*\n*Shablon ariza* — ${shablon}\n   Tayyor Word shablon faylini olasiz\n\n*Professional ariza* — ${professional}\n   Yurist sizning holatIngizga mos ariza yozib beradi\n\n*Konsultatsiya* — ${consultation}\n   Telefon orqali huquqiy maslahat\n\n*Qozibuva AI ⚖️* — 3 ta bepul\n   O'zbekiston qonunchiligi bo'yicha AI maslahat\n\n*Qanday ishlaydi?*\n1. Xizmatni tanlang\n2. Karta raqamiga to'lov qiling\n3. To'lov cheki (screenshot) yuboring\n4. Admin tasdiqlaydi → xizmat yuboriladi`;
}
