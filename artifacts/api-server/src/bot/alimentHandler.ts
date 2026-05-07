import TelegramBot from "node-telegram-bot-api";
import { MZOT, AVG_SALARY } from "./config";
import { getState, setState } from "./state";
import { getLang } from "./userProfile";
import type { Lang } from "./userProfile";

type AlimentChildren = "1" | "2" | "3" | "3plus";

// ── Maosh parser (moslashuvchan format) ───────────────────────────────────────
function parseSalary(raw: string): number | null {
  const s = raw.toLowerCase().trim();

  // "mln" yoki "mlrd" qo'shimchasi: "3.5 mln", "3,5mln", "1.2mlrd"
  const mlnMatch = s.match(/^([\d][.\d,\s]*)mln/);
  if (mlnMatch) {
    const num = parseFloat(mlnMatch[1]!.replace(/,/g, ".").replace(/\s/g, ""));
    if (!isNaN(num)) return Math.round(num * 1_000_000);
  }
  const mlrdMatch = s.match(/^([\d][.\d,\s]*)mlrd/);
  if (mlrdMatch) {
    const num = parseFloat(mlrdMatch[1]!.replace(/,/g, ".").replace(/\s/g, ""));
    if (!isNaN(num)) return Math.round(num * 1_000_000_000);
  }

  // Nuqta minglik ajratuvchi sifatida: "3.500.000" yoki "3.500"
  // Agar nuqtadan keyin doim 3 ta raqam kelsa — minglik ajratuvchi
  if (/^\d{1,3}(\.\d{3})+$/.test(s)) {
    const n = parseInt(s.replace(/\./g, ""), 10);
    if (!isNaN(n) && n > 0) return n;
  }

  // Bo'shliq yoki apostrof ajratuvchi: "3 500 000", "3'500'000"
  const spaced = s.replace(/[\s_']/g, "").replace(/,/g, "");
  const n = Number(spaced);
  if (!isNaN(n) && n > 0) return Math.round(n);

  return null;
}

// ── Klaviaturalar ─────────────────────────────────────────────────────────────

export function alimentStatusKeyboard(lang: Lang): TelegramBot.InlineKeyboardMarkup {
  const cy = lang === "cyrillic";
  return {
    inline_keyboard: [
      [
        { text: cy ? "Ишлайди"   : "Ishlaydi",   callback_data: "aliment_status:employed" },
        { text: cy ? "Ишламайди" : "Ishlamaydi", callback_data: "aliment_status:unemployed" },
      ],
      [{ text: cy ? "🔙 Орқага" : "🔙 Orqaga", callback_data: "back_main" }],
    ],
  };
}

export function alimentChildrenKeyboard(lang: Lang): TelegramBot.InlineKeyboardMarkup {
  const cy = lang === "cyrillic";
  return {
    inline_keyboard: [
      [
        { text: cy ? "1 та бола" : "1 ta bola", callback_data: "aliment_children:1" },
        { text: cy ? "2 та бола" : "2 ta bola", callback_data: "aliment_children:2" },
      ],
      [
        { text: cy ? "3 ва ундан ортиқ" : "3 va undan ortiq", callback_data: "aliment_children:3plus" },
      ],
      [{ text: cy ? "🔙 Орқага" : "🔙 Orqaga", callback_data: "aliment_back_to_salary" }],
    ],
  };
}

export function alimentConfirmKeyboard(lang: Lang): TelegramBot.InlineKeyboardMarkup {
  const cy = lang === "cyrillic";
  return {
    inline_keyboard: [
      [{ text: cy ? "Ҳисоблаш" : "Hisoblash", callback_data: "aliment_calculate" }],
      [{ text: cy ? "🔙 Орқага"   : "🔙 Orqaga",    callback_data: "aliment_back_to_children" }],
      [{ text: cy ? "🏠 Бош меню" : "🏠 Bosh menyu", callback_data: "back_main" }],
    ],
  };
}

// ── Hisoblash ─────────────────────────────────────────────────────────────────

function calcAliment(salary: number, children: AlimentChildren): {
  amount: number;
  minimumPerChild: number;
  fractionLabel: string;
  childCount: number;
  isThreePlus: boolean;
} {
  let fraction: number;
  let fractionLabel: string;
  let childCount: number;
  const isThreePlus = children === "3plus";

  switch (children) {
    case "1":
      fraction = 1 / 4;
      fractionLabel = "1/4 (25%)";
      childCount = 1;
      break;
    case "2":
      fraction = 1 / 3;
      fractionLabel = "1/3 (33,3%)";
      childCount = 2;
      break;
    case "3":
      fraction = 1 / 2;
      fractionLabel = "1/2 (50%)";
      childCount = 3;
      break;
    default: // 3plus
      fraction = 1 / 2;
      fractionLabel = "1/2 (50%)";
      childCount = 3;
  }

  const amount         = Math.round(salary * fraction);
  const minimumPerChild = Math.round(MZOT * 0.265);
  return { amount, minimumPerChild, fractionLabel, childCount, isThreePlus };
}

function fmt(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// ── Natija matni ──────────────────────────────────────────────────────────────

function buildResultText(
  lang: Lang,
  status: "employed" | "unemployed",
  salary: number,
  children: AlimentChildren,
): string {
  const cy = lang === "cyrillic";
  const { amount, minimumPerChild, fractionLabel, childCount, isThreePlus } = calcAliment(salary, children);

  // Label for children selection
  const childrenLabel = (() => {
    if (cy) {
      if (children === "1") return "1 та бола";
      if (children === "2") return "2 та бола";
      return "3 ва ундан ортиқ бола";
    }
    if (children === "1") return "1 ta bola";
    if (children === "2") return "2 ta bola";
    return "3 va undan ortiq bola";
  })();

  // For 3plus: minimum shown per child (exact count unknown)
  // For 1/2: total minimum = minimumPerChild × childCount
  const minimumTotal = minimumPerChild * childCount;
  const finalAmount  = Math.max(amount, minimumTotal);
  const isMinApplied = amount < minimumTotal;

  const statusLabel = status === "employed"
    ? (cy ? "Ишлайди"   : "Ishlaydi")
    : (cy ? "Ишламайди" : "Ishlamaydi");

  const salaryLabel = status === "unemployed"
    ? (cy ? `Ўртача маош (${fmt(AVG_SALARY)} сўм)` : `O'rtacha maosh (${fmt(AVG_SALARY)} so'm)`)
    : (cy ? `${fmt(salary)} сўм` : `${fmt(salary)} so'm`);

  // For 3plus: show per-child minimum with a note; otherwise show total
  const minimumLine = isThreePlus
    ? (cy
        ? `Қонуний минимум: *ҳар бир бола учун ${fmt(minimumPerChild)} сўм/ой*`
        : `Qonuniy minimum: *har bir bola uchun ${fmt(minimumPerChild)} so'm/oy*`)
    : (cy
        ? `Қонуний минимум: *${fmt(minimumPerChild)} сўм × ${childCount} = ${fmt(minimumTotal)} сўм/ой*`
        : `Qonuniy minimum: *${fmt(minimumPerChild)} so'm × ${childCount} = ${fmt(minimumTotal)} so'm/oy*`);

  if (cy) {
    return (
      `*Алимент ҳисоби — Натижа*\n\n` +
      `Ҳолат: *${statusLabel}*\n` +
      `Маош: *${salaryLabel}*\n` +
      `Болалар: *${childrenLabel}*\n` +
      `Улуш: *${fractionLabel}*\n\n` +
      (isThreePlus
        ? `✅ Алимент тўлови ойига *${fmt(amount)} сўм*ни ташкил этади\n_(ҳар бир бола учун камида ${fmt(minimumPerChild)} сўм)_\n`
        : `✅ Алимент тўлови ойига *${fmt(finalAmount)} сўм*ни ташкил этади\n` +
          (isMinApplied ? `\n⚠️ _Ҳисобланган миқдор минимумдан кам — минимал миқдор қўлланилди._\n` : ``)) +
      `\n_Оила кодексининг 99-моддасига асосан. Аниқ миқдорни суд белгилайди._`
    );
  }

  return (
    `*Aliment hisob — Natija*\n\n` +
    `Holat: *${statusLabel}*\n` +
    `Maosh: *${salaryLabel}*\n` +
    `Bolalar: *${childrenLabel}*\n` +
    `Ulush: *${fractionLabel}*\n\n` +
    (isThreePlus
      ? `✅ Aliment to'lovi oyiga *${fmt(amount)} so'm*ni tashkil etadi\n_(har bir bola uchun kamida ${fmt(minimumPerChild)} so'm)_\n`
      : `✅ Aliment to'lovi oyiga *${fmt(finalAmount)} so'm*ni tashkil etadi\n` +
        (isMinApplied ? `\n⚠️ _Hisoblangan miqdor minimumdan kam — minimal miqdor qo'llanildi._\n` : ``)) +
    `\n_Oila kodeksining 99-moddasiga asosan. Aniq miqdorni sud belgilaydi._`
  );
}

// ── Matn xabarlari ────────────────────────────────────────────────────────────

export function tAlimentIntro(lang: Lang): string {
  const cy = lang === "cyrillic";
  return cy
    ? `*Алимент калькулятори*\n\nОила кодексининг 99-моддасига асосан алимент миқдорини ҳисоблаш.\n\nҚарздорнинг ҳолатини танланг:`
    : `*Aliment kalkulyatori*\n\nOila kodeksining 99-moddasiga asosan aliment miqdorini hisoblash.\n\nQarzdorning holatini tanlang:`;
}

export function tAlimentSalaryPrompt(lang: Lang): string {
  const cy = lang === "cyrillic";
  return cy
    ? `*Қарздорнинг oylik маошини киритинг:*\n\nМасалан: \`3.500.000\` ёки \`3.5 mln\``
    : `*Qarzdorning oylik maoshini kiriting:*\n\nMasalan: \`3.500.000\` yoki \`3.5 mln\``;
}

export function tAlimentChildrenPrompt(lang: Lang, status: "employed" | "unemployed", salary?: number): string {
  const cy = lang === "cyrillic";
  const statusLine = status === "employed"
    ? (cy ? `Ишлайди | Маош: *${fmt(salary ?? 0)} сўм*` : `Ishlaydi | Maosh: *${fmt(salary ?? 0)} so'm*`)
    : (cy ? `Ишламайди | Ўртача маош: *${fmt(AVG_SALARY)} сўм*` : `Ishlamaydi | O'rtacha maosh: *${fmt(AVG_SALARY)} so'm*`);
  return cy
    ? `${statusLine}\n\nБолалар sonini tanlang:`
    : `${statusLine}\n\nBolalar sonini tanlang:`;
}

export function tAlimentConfirmPrompt(
  lang: Lang,
  status: "employed" | "unemployed",
  salary: number,
  children: AlimentChildren,
): string {
  const cy = lang === "cyrillic";
  const childrenLabel = (c: AlimentChildren) => {
    const map: Record<AlimentChildren, [string, string]> = {
      "1":     ["1 та бола",             "1 ta bola"],
      "2":     ["2 та бола",             "2 ta bola"],
      "3":     ["3 ва ундан ортиқ бола", "3 va undan ortiq bola"],
      "3plus": ["3 ва ундан ортиқ бола", "3 va undan ortiq bola"],
    };
    return cy ? map[c][0] : map[c][1];
  };
  const statusLine = status === "employed"
    ? (cy ? `Ишлайди | Маош: *${fmt(salary)} сўм*` : `Ishlaydi | Maosh: *${fmt(salary)} so'm*`)
    : (cy ? `Ишламайди | Ўртача маош: *${fmt(AVG_SALARY)} сўм*` : `Ishlamaydi | O'rtacha maosh: *${fmt(AVG_SALARY)} so'm*`);
  return cy
    ? `${statusLine}\nБолалар: *${childrenLabel(children)}*\n\nHisoblash tugmasini bosing:`
    : `${statusLine}\nBolalar: *${childrenLabel(children)}*\n\nHisoblash tugmasini bosing:`;
}

// ── Asosiy handler ────────────────────────────────────────────────────────────

export async function handleAliment(
  bot: TelegramBot,
  userId: number,
  chatId: number,
  messageId: number,
  data: string,
): Promise<boolean> {
  const lang = getLang(userId);
  const state = getState(userId);

  async function safeEdit(text: string, markup: TelegramBot.InlineKeyboardMarkup) {
    try {
      await bot.editMessageText(text, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: "Markdown",
        reply_markup: markup,
      });
    } catch {
      await bot.sendMessage(chatId, text, { parse_mode: "Markdown", reply_markup: markup });
    }
  }

  // ── Kirish ────────────────────────────────────────────────────────────────
  if (data === "menu_aliment") {
    setState(userId, { step: "idle" });
    await safeEdit(tAlimentIntro(lang), alimentStatusKeyboard(lang));
    return true;
  }

  // ── Holat tanlash ─────────────────────────────────────────────────────────
  if (data.startsWith("aliment_status:")) {
    const status = data.slice("aliment_status:".length) as "employed" | "unemployed";

    if (status === "employed") {
      setState(userId, { ...state, step: "aliment_salary", alimentStatus: "employed" });
      await safeEdit(tAlimentSalaryPrompt(lang), {
        inline_keyboard: [[{ text: lang === "cyrillic" ? "🔙 Орқага" : "🔙 Orqaga", callback_data: "menu_aliment" }]],
      });
    } else {
      const salary = AVG_SALARY;
      setState(userId, { ...state, step: "aliment_children", alimentStatus: "unemployed", alimentSalary: salary });
      await safeEdit(
        tAlimentChildrenPrompt(lang, "unemployed"),
        alimentChildrenKeyboard(lang),
      );
    }
    return true;
  }

  // ── Bolalar soni — avtomatik hisoblash ───────────────────────────────────
  if (data.startsWith("aliment_children:")) {
    const children = data.slice("aliment_children:".length) as AlimentChildren;
    const alimentStatus = state.alimentStatus ?? "employed";
    const alimentSalary = state.alimentSalary ?? MZOT;
    setState(userId, { step: "idle", alimentStatus, alimentSalary, alimentChildren: children });
    const result = buildResultText(lang, alimentStatus, alimentSalary, children);
    await safeEdit(result, {
      inline_keyboard: [
        [{ text: lang === "cyrillic" ? "🔄 Қайта ҳисоблаш" : "🔄 Qayta hisoblash", callback_data: "menu_aliment" }],
        [{ text: lang === "cyrillic" ? "🏠 Бош меню"        : "🏠 Bosh menyu",       callback_data: "back_main" }],
      ],
    });
    return true;
  }

  // ── Orqaga: bolalar → salary ──────────────────────────────────────────────
  if (data === "aliment_back_to_salary") {
    setState(userId, { ...state, step: "aliment_salary", alimentChildren: undefined });
    await safeEdit(tAlimentSalaryPrompt(lang), {
      inline_keyboard: [[{ text: lang === "cyrillic" ? "🔙 Орқага" : "🔙 Orqaga", callback_data: "menu_aliment" }]],
    });
    return true;
  }

  return false;
}

// ── Maosh matni qabul qilish (message handler dan chaqiriladi) ────────────────

export async function handleAlimentSalaryInput(
  bot: TelegramBot,
  userId: number,
  chatId: number,
  text: string,
): Promise<boolean> {
  const lang = getLang(userId);
  const state = getState(userId);
  if (state.step !== "aliment_salary") return false;

  const cy = lang === "cyrillic";
  const salary = parseSalary(text.trim());

  if (salary === null || salary <= 0) {
    await bot.sendMessage(
      chatId,
      cy
        ? "⚠️ Нотўғри формат. Мисоллар: `3.500.000`, `3 500 000`, `3.5 mln`"
        : "⚠️ Noto'g'ri format. Misollar: `3.500.000`, `3 500 000`, `3.5 mln`",
      { parse_mode: "Markdown" },
    );
    return true;
  }

  setState(userId, { ...state, step: "aliment_children", alimentStatus: "employed", alimentSalary: salary });
  await bot.sendMessage(
    chatId,
    tAlimentChildrenPrompt(lang, "employed", salary),
    { parse_mode: "Markdown", reply_markup: alimentChildrenKeyboard(lang) },
  );
  return true;
}
