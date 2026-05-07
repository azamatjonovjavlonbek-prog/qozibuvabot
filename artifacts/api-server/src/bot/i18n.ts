import type { Lang } from "./userProfile";

const S: Record<string, Record<Lang, string>> = {
  welcome_lang: {
    latin:    "👋 Assalomu alaykum!\n\nIltimos, qulay tilni tanlang:",
    cyrillic: "👋 Ассалому алайкум!\n\nИлтимос, қулай тилни танланг:",
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
    latin:    "✅ Raqamingiz saqlandi! Xush kelibsiz 🎉\n\nQuyidagi xizmatlardan birini tanlang:",
    cyrillic: "✅ Рақамингиз сақланди! Хуш келибсиз 🎉\n\nҚуйидаги хизматлардан бирини танланг:",
  },
  main_menu: {
    latin:    "🏠 *Bosh menyu*\n\nQuyidagi xizmatlardan birini tanlang:",
    cyrillic: "🏠 *Бош меню*\n\nҚуйидаги хизматлардан бирини танланг:",
  },
  btn_ariza: {
    latin:    "📄 Ariza bo'limi",
    cyrillic: "📄 Ариза бўлими",
  },
  btn_consultation: {
    latin:    "📞 Konsultatsiya",
    cyrillic: "📞 Консультация",
  },
  btn_contact: {
    latin:    "👨‍💼 Adminga murojat",
    cyrillic: "👨‍💼 Админга мурожат",
  },
  btn_about: {
    latin:    "ℹ️ Biz haqimizda",
    cyrillic: "ℹ️ Биз ҳақимизда",
  },
  btn_courts: {
    latin:    "🏛 Sudlar manzillari",
    cyrillic: "🏛 Судлар манзиллари",
  },
  btn_clear: {
    latin:    "🗑 Chatni tozalash",
    cyrillic: "🗑 Чатни тозалаш",
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
    latin:    "📝 Shablon ariza",
    cyrillic: "📝 Шаблон ариза",
  },
  btn_professional_menu: {
    latin:    "✍️ Professional ariza",
    cyrillic: "✍️ Профессионал ариза",
  },
  btn_order: {
    latin:    "💳 Buyurtma berish",
    cyrillic: "💳 Буюртма бериш",
  },
  btn_write_msg: {
    latin:    "✏️ Xabar yozish",
    cyrillic: "✏️ Хабар ёзиш",
  },
  ariza_menu: {
    latin:    "📄 *Ariza bo'limi*\n\nQuyidagi ikki xizmatdan birini tanlang:\n\n📝 *Shablon ariza* — tayyor shablon, ba'zi ma'lumotlarni o'zingiz to'ldirasiz.\n✍️ *Professional ariza* — yurist tomonidan to'liq yozib beriladi.",
    cyrillic: "📄 *Ариза бўлими*\n\nҚуйидаги икки хизматдан бирини танланг:\n\n📝 *Шаблон ариза* — тайёр шаблон, баъзи маълумотларни ўзингиз тўлдирасиз.\n✍️ *Профессионал ариза* — юрист томонидан тўлиқ ёзиб берилади.",
  },
  contact_title: {
    latin:    "👨‍💼 *Adminga murojat*\n\nSavol, taklif yoki muammongiz bo'lsa, administratorimiz tez orada javob beradi.\n\n✏️ Xabar yozish tugmasini bosing va so'rovingizni yozing.",
    cyrillic: "👨‍💼 *Админга мурожат*\n\nСавол, таклиф ёки муаммоингиз бўлса, администраторимиз тез орада жавоб беради.\n\n✏️ Хабар ёзиш тугмасини босинг ва сўровингизни ёзинг.",
  },
  contact_write_prompt: {
    latin:    "✏️ *Savolingizni yozing:*\n\nXabaringizni quyida yuboring — admin imkon qadar tez javob beradi.",
    cyrillic: "✏️ *Саволингизни ёзинг:*\n\nХабарингизни қуйида юборинг — админ имкон қадар тез жавоб беради.",
  },
  contact_sent: {
    latin:    "✅ *Xabaringiz adminga yuborildi!*\n\nTez orada javob beriladi.",
    cyrillic: "✅ *Хабарингиз админга юборилди!*\n\nТез орада жавоб берилади.",
  },
  admin_reply_label: {
    latin:    "👨‍💼 *Admin javobi:*",
    cyrillic: "👨‍💼 *Админ жавоби:*",
  },
  contact_only_text: {
    latin:    "✏️ Iltimos, matn xabar yuboring.",
    cyrillic: "✏️ Илтимос, матн хабар юборинг.",
  },
  send_check_prompt: {
    latin:    "📸 Iltimos, to'lov chekini *rasm yoki fayl* sifatida yuboring.",
    cyrillic: "📸 Илтимос, тўлов чекини *расм ёки файл* сифатида юборинг.",
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
    latin:    "✅ *To'lovingiz tasdiqlandi!*\n\n✍️ *Professional ariza* buyurtmangiz qabul qilindi.\n\nYuristimiz tez orada siz bilan bog'lanib, kerakli ma'lumotlarni so'raydi. Iltimos, kutib turing.",
    cyrillic: "✅ *Тўловингиз тасдиқланди!*\n\n✍️ *Профессионал ариза* буюртмангиз қабул қилинди.\n\nЮристимиз тез орада сиз билан боғланиб, керакли маълумотларни сўрайди. Илтимос, кутиб туринг.",
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

export function tMainMenu(lang: Lang, shablon: string, professional: string, consultation: string, card: string, owner: string, hours: string): string {
  return lang === "cyrillic"
    ? `ℹ️ *QoziBuva Ҳуқуқий Хизматлар*\n\nБиз Ўзбекистон фуқароларига тез ва сифатли ҳуқуқий ёрдам кўрсатамиз.\n\n⚖️ *Хизматларимиз:*\n📝 Шаблон ариза — *${shablon}*\n✍️ Профессионал ариза — *${professional}*\n📞 Консультация — *${consultation}*\n\n🏦 *Тўлов:*\nКарта: \`${card}\`\nЭгаси: *${owner}*\n\n🕐 *Иш вақти:* ${hours}\n\n💬 Савол ва таклифлар учун "Админга мурожат" тугмасини босинг.`
    : `ℹ️ *QoziBuva Huquqiy Xizmatlar*\n\nBiz O'zbekiston fuqarolariga tez va sifatli huquqiy yordam ko'rsatamiz.\n\n⚖️ *Xizmatlarimiz:*\n📝 Shablon ariza — *${shablon}*\n✍️ Professional ariza — *${professional}*\n📞 Konsultatsiya — *${consultation}*\n\n🏦 *To'lov:*\nKarta: \`${card}\`\nEgasi: *${owner}*\n\n🕐 *Ish vaqti:* ${hours}\n\n💬 Savol va takliflar uchun "Adminga murojat" tugmasini bosing.`;
}

export function tShablonList(lang: Lang, price: string): string {
  return lang === "cyrillic"
    ? `📝 *Шаблон ариза*\n\nНархи: *${price}*\n\nТайёр шаблон файлингиз юборилади. Ундаги бўш жойларни ўзингиз тўлдирасиз.\n\nҚайси мавзу бўйича ариза керак?`
    : `📝 *Shablon ariza*\n\nNarxi: *${price}*\n\nTayyor shablon faylingiz yuboriladi. Undagi bo'sh joylarni o'zingiz to'ldirasiz.\n\nQaysi mavzu bo'yicha ariza kerak?`;
}

export function tShablonConfirm(lang: Lang, label: string, price: string): string {
  return lang === "cyrillic"
    ? `📝 *${label} — Шаблон ариза*\n\nТайёр шаблон файлини оласиз ва ундаги бўш жойларни ўзингиз тўлдирасиз.\n\n💰 Нархи: *${price}*`
    : `📝 *${label} — Shablon ariza*\n\nTayyor shablon faylini olasiz va undagi bo'sh joylarni o'zingiz to'ldirasiz.\n\n💰 Narxi: *${price}*`;
}

export function tPayShablon(lang: Lang, label: string, price: string, card: string, owner: string): string {
  return lang === "cyrillic"
    ? `💳 *Тўлов маълумотлари*\n\nХизмат: *${label} (Шаблон)*\nСумма: *${price}*\n\n🏦 Карта рақами:\n\`${card}\`\n👤 Карта эгаси: *${owner}*\n\n✅ Тўлов қилгандан сўнг *тўлов чеки (screenshot) расмини* шу чатга юборинг.`
    : `💳 *To'lov ma'lumotlari*\n\nXizmat: *${label} (Shablon)*\nSumma: *${price}*\n\n🏦 Karta raqami:\n\`${card}\`\n👤 Karta egasi: *${owner}*\n\n✅ To'lov qilgandan so'ng *to'lov cheki (screenshot) rasmini* shu chatga yuboring.`;
}

export function tProfessional(lang: Lang, price: string): string {
  return lang === "cyrillic"
    ? `✍️ *Профессионал ариза*\n\nЮристимиз сизнинг ҳолатингизга мос ариза ёзиб беради.\n\n💰 Нархи: *${price}*\n\n📌 Буюртма берганда сўнг юристимиз сиз билан боғланиб, керакли маълумотларни сўрайди ва тайёр аризани бот орқали юборади.`
    : `✍️ *Professional ariza*\n\nYuristimiz sizning holatIngizga mos ariza yozib beradi.\n\n💰 Narxi: *${price}*\n\n📌 Buyurtma bergandan so'ng yuristimiz siz bilan bog'lanib, kerakli ma'lumotlarni so'raydi va tayyor arizani bot orqali yuboradi.`;
}

export function tPayProfessional(lang: Lang, price: string, card: string, owner: string): string {
  return lang === "cyrillic"
    ? `💳 *Тўлов маълумотлари*\n\nХизмат: *Профессионал ариза*\nНархи: *${price}*\n\n🏦 Карта рақами:\n\`${card}\`\n👤 Карта эгаси: *${owner}*\n\n✅ Тўлов қилгандан сўнг *тўлов чеки (screenshot) расмини* шу чатга юборинг.\n\nℹ️ Юристимиз тўлов тасдиқлангач нархни аниқлаштиради.`
    : `💳 *To'lov ma'lumotlari*\n\nXizmat: *Professional ariza*\nNarxi: *${price}*\n\n🏦 Karta raqami:\n\`${card}\`\n👤 Karta egasi: *${owner}*\n\n✅ To'lov qilgandan so'ng *to'lov cheki (screenshot) rasmini* shu chatga yuboring.\n\nℹ️ Yuristimiz to'lov tasdiqlangach narxni aniqlashtiradi.`;
}

export function tConsultation(lang: Lang, price: string, hours: string): string {
  return lang === "cyrillic"
    ? `📞 *Консультация хизмати*\n\nҲуқуқий масалаларингиз бўйича мутахассисимиз билан боғланинг.\n\n💰 Нархи: *${price}*\n🕐 Иш вақти: *${hours}*\n\nТўловдан сўнг телефон рақамимиз юборилади.`
    : `📞 *Konsultatsiya xizmati*\n\nHuquqiy masalalaringiz bo'yicha mutaxassisimiz bilan bog'laning.\n\n💰 Narxi: *${price}*\n🕐 Ish vaqti: *${hours}*\n\nTo'lovdan so'ng telefon raqamimiz yuboriladi.`;
}

export function tPayConsultation(lang: Lang, price: string, card: string, owner: string): string {
  return lang === "cyrillic"
    ? `💳 *Тўлов маълумотлари*\n\nХизмат: *Консультация*\nСумма: *${price}*\n\n🏦 Карта рақами:\n\`${card}\`\n👤 Карта эгаси: *${owner}*\n\n✅ Тўлов қилгандан сўнг *тўлов чеки (screenshot) расмини* шу чатга юборинг.`
    : `💳 *To'lov ma'lumotlari*\n\nXizmat: *Konsultatsiya*\nSumma: *${price}*\n\n🏦 Karta raqami:\n\`${card}\`\n👤 Karta egasi: *${owner}*\n\n✅ To'lov qilgandan so'ng *to'lov cheki (screenshot) rasmini* shu chatga yuboring.`;
}

export function tApprovedShablon(lang: Lang, label: string): string {
  return lang === "cyrillic"
    ? `✅ *Тўловингиз тасдиқланди!*\n\n📄 *${label}* шаблон аризаси қуйида юборилмоқда...`
    : `✅ *To'lovingiz tasdiqlandi!*\n\n📄 *${label}* shablon arizasi quyida yuborilmoqda...`;
}

export function tApprovedConsultation(lang: Lang, phone: string, hours: string): string {
  return lang === "cyrillic"
    ? `✅ *Тўловингиз тасдиқланди!*\n\n📞 Мутахассисимиз билан боғланинг:\n\n🔗 Телефон: *${phone}*\n🕐 Иш вақти: *${hours}*\n\nКўрсатилган вақт оралиғида қўнғироқ қилинг! ✨`
    : `✅ *To'lovingiz tasdiqlandi!*\n\n📞 Mutaxassisimiz bilan bog'laning:\n\n🔗 Telefon: *${phone}*\n🕐 Ish vaqti: *${hours}*\n\nKo'rsatilgan vaqt oralig'ida qo'ng'iroq qiling! ✨`;
}

export function tCatLabel(lang: Lang, latinLabel: string): string {
  if (lang !== "cyrillic") return latinLabel;
  const map: Record<string, string> = {
    "Nikohdan ajratish":         "Никоҳдан ажратиш",
    "Aliment undirish":          "Алимент ундириш",
    "Jarima (radar) bekor qilish": "Жарима (радар) бекор қилиш",
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
    ? `ℹ️ *QoziBuva Ҳуқуқий Хизматлар*\n\n📋 *Хизматлар:*\n📝 *Шаблон ариза* — ${shablon}\n   Тайёр Word шаблон файлини оласиз\n\n✍️ *Профессионал ариза* — ${professional}\n   Юрист сизнинг ҳолатингизга мос ариза ёзиб беради\n\n📞 *Консультация* — ${consultation}\n   Телефон орқали ҳуқуқий маслаҳат\n\n📌 *Қандай ишлайди?*\n1. Хизматни танланг\n2. Карта рақамига тўлов қилинг\n3. Тўлов чеки (screenshot) юборинг\n4. Админ тасдиқлайди → хизмат юборилади\n\n👨‍💼 Савол бўлса: "Админга мурожат" тугмасини босинг`
    : `ℹ️ *QoziBuva Huquqiy Xizmatlar*\n\n📋 *Xizmatlar:*\n📝 *Shablon ariza* — ${shablon}\n   Tayyor Word shablon faylini olasiz\n\n✍️ *Professional ariza* — ${professional}\n   Yurist sizning holatIngizga mos ariza yozib beradi\n\n📞 *Konsultatsiya* — ${consultation}\n   Telefon orqali huquqiy maslahat\n\n📌 *Qanday ishlaydi?*\n1. Xizmatni tanlang\n2. Karta raqamiga to'lov qiling\n3. To'lov cheki (screenshot) yuboring\n4. Admin tasdiqlaydi → xizmat yuboriladi\n\n👨‍💼 Savol bo'lsa: "Adminga murojat" tugmasini bosing`;
}
