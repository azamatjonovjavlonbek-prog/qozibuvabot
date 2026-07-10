import TelegramBot from "node-telegram-bot-api";
import {
  OLIY_SUD, REGIONS, COURT_TYPES, getCourts,
  type CourtType, type CourtEntry,
} from "./courtsData";
import { getLang } from "./userProfile";
import type { Lang } from "./userProfile";
import { latinToCyrillic } from "./latinToCyrillic";
import { recordEvent } from "./statsStore";

// ── Keyboard helpers ──────────────────────────────────────────────────────────

function courtTypesKeyboard(lang: Lang): TelegramBot.InlineKeyboardMarkup {
  return {
    inline_keyboard: [
      [{ text: lang === "cyrillic" ? "⚖️ Олий суд" : "⚖️ Oliy sud", callback_data: "ct:oliy" }],
      [{ text: lang === "cyrillic" ? "🔴 Жиноят ишлари бўйича судлар" : "🔴 Jinoyat ishlar bo'yicha sudlar", callback_data: "ct:jin" }],
      [{ text: lang === "cyrillic" ? "🔵 Фуқаролик ишлари бўйича судлар" : "🔵 Fuqarolik ishlar bo'yicha sudlar", callback_data: "ct:fuq" }],
      [{ text: lang === "cyrillic" ? "🟡 Маъмурий судлар" : "🟡 Ma'muriy sudlar", callback_data: "ct:mam" }],
      [{ text: lang === "cyrillic" ? "🟢 Иқтисодий судлар" : "🟢 Iqtisodiy sudlar", callback_data: "ct:iqt" }],
      [{ text: lang === "cyrillic" ? "🔙 Орқага" : "🔙 Orqaga", callback_data: "back_main" }],
    ],
  };
}

function regionsKeyboard(type: CourtType, lang: Lang): TelegramBot.InlineKeyboardMarkup {
  const rows: TelegramBot.InlineKeyboardButton[][] = REGIONS.map((r) => [
    { text: lang === "cyrillic" ? r.nameCy : r.name, callback_data: `cr:${type}:${r.id}` },
  ]);
  rows.push([{ text: lang === "cyrillic" ? "🔙 Орқага" : "🔙 Orqaga", callback_data: "courts" }]);
  return { inline_keyboard: rows };
}

function courtsListKeyboard(
  type: CourtType,
  regionId: string,
  courts: CourtEntry[],
  lang: Lang,
): TelegramBot.InlineKeyboardMarkup {
  const rows: TelegramBot.InlineKeyboardButton[][] = courts.map((c, i) => [
    { text: `🏛 ${c.name}`, callback_data: `cd:${type}:${regionId}:${i}` },
  ]);
  rows.push([{ text: lang === "cyrillic" ? "🔙 Орқага" : "🔙 Orqaga", callback_data: `ct:${type}` }]);
  return { inline_keyboard: rows };
}

function courtDetailKeyboard(backData: string, lang: Lang): TelegramBot.InlineKeyboardMarkup {
  return {
    inline_keyboard: [
      [{ text: lang === "cyrillic" ? "🔙 Орқага" : "🔙 Orqaga", callback_data: backData }],
      [{ text: lang === "cyrillic" ? "🏠 Бош меню" : "🏠 Bosh menyu", callback_data: "back_main" }],
    ],
  };
}

// ── Court info message ────────────────────────────────────────────────────────
function formatCourtInfo(court: CourtEntry, lang: Lang): string {
  const cy = lang === "cyrillic";
  const name    = cy ? latinToCyrillic(court.name)    : court.name;
  const address = cy ? latinToCyrillic(court.address) : court.address;
  // Telefon: vergulgacha birinchi raqam tel: link, qolganlari oddiy matn
  const phoneMain = court.phone.split(",")[0]!.trim();
  const phoneRest = court.phone.includes(",")
    ? ", " + court.phone.split(",").slice(1).join(",").trim()
    : "";
  const phoneTel = phoneMain.replace(/[\s()-]/g, "");

  const lines: string[] = [
    `🏛 *${name}*`,
    ``,
    `📍 *${cy ? "Манзил" : "Manzil"}:*`,
    `${address}`,
    ``,
    `📞 *${cy ? "Телефон" : "Telefon"}:* [${phoneMain}](tel:${phoneTel})${phoneRest}`,
  ];
  if (court.email) {
    lines.push(`📧 *Email:* ${court.email}`);
  }
  if (court.jadval) {
    lines.push(`📅 *${cy ? "Жадвал" : "Jadval"}:* [${court.jadval}](https://${court.jadval})`);
  }
  return lines.join("\n");
}

// ── Har foydalanuvchining oxirgi venue/lokatsiya xabari ID si ─────────────────
const lastVenueMsg = new Map<number, number>(); // userId → message_id

async function deleteLastVenue(bot: TelegramBot, userId: number, chatId: number) {
  const msgId = lastVenueMsg.get(userId);
  if (!msgId) return;
  try { await bot.deleteMessage(chatId, msgId); } catch { /* ignore */ }
  lastVenueMsg.delete(userId);
}

// ── Text-triggered entry (reply keyboard) ─────────────────────────────────────
export async function sendCourtsIntro(
  bot: TelegramBot,
  chatId: number,
  userId: number,
): Promise<void> {
  const lang = getLang(userId);
  await bot.sendMessage(
    chatId,
    lang === "cyrillic"
      ? "⚖️ *Судлар манзиллари*\n\nСуд турини танланг:"
      : "⚖️ *Sudlar manzillari*\n\nSud turini tanlang:",
    { parse_mode: "Markdown", reply_markup: courtTypesKeyboard(lang) },
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export async function handleCourts(
  bot: TelegramBot,
  query: TelegramBot.CallbackQuery,
  data: string,
  chatId: number,
  messageId: number,
): Promise<boolean> {
  const userId = query.from.id;
  const lang = getLang(userId);

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

  // ── Bosh bo'lim ─────────────────────────────────────────────────────────────
  if (data === "courts") {
    recordEvent(userId, "courts_view");
    await safeEdit(
      lang === "cyrillic"
        ? "⚖️ *Судлар манзиллари*\n\nСуд турини танланг:"
        : "⚖️ *Sudlar manzillari*\n\nSud turini tanlang:",
      courtTypesKeyboard(lang),
    );
    return true;
  }

  // ── Oliy sud ─────────────────────────────────────────────────────────────────
  if (data === "ct:oliy") {
    const c = OLIY_SUD;
    const text = formatCourtInfo(c, lang);
    await deleteLastVenue(bot, userId, chatId);
    await safeEdit(text, courtDetailKeyboard("courts", lang));
    if (c.lat && c.lng) {
      try {
        const cy = lang === "cyrillic";
        const venueName    = cy ? latinToCyrillic(c.name)    : c.name;
        const venueAddress = cy ? latinToCyrillic(c.address) : c.address;
        const sent = await bot.sendVenue(chatId, c.lat, c.lng, venueName, venueAddress);
        lastVenueMsg.set(userId, sent.message_id);
      } catch { /* ignore */ }
    }
    return true;
  }

  // ── Sud turi tanlandi → hududlar ────────────────────────────────────────────
  if (data.startsWith("ct:")) {
    const type = data.slice(3) as CourtType;
    const typeInfo = COURT_TYPES.find((t) => t.id === type);
    if (!typeInfo) return false;

    const label = lang === "cyrillic" ? typeInfo.nameCy : typeInfo.name;
    await safeEdit(
      `🏛 *${label}*\n\n${lang === "cyrillic" ? "Худудни танланг:" : "Hududni tanlang:"}`,
      regionsKeyboard(type, lang),
    );
    return true;
  }

  // ── Hudud tanlandi → sudlar ro'yxati ─────────────────────────────────────────
  if (data.startsWith("cr:")) {
    const parts = data.split(":");
    const type = parts[1] as CourtType;
    const regionId = parts[2]!;
    const region = REGIONS.find((r) => r.id === regionId);
    if (!region) return false;

    const courts = getCourts(type, regionId);
    if (courts.length === 0) {
      await safeEdit(
        lang === "cyrillic" ? "⚠️ Маълумот топилмади." : "⚠️ Ma'lumot topilmadi.",
        { inline_keyboard: [[{ text: lang === "cyrillic" ? "🔙 Орқага" : "🔙 Orqaga", callback_data: `ct:${type}` }]] },
      );
      return true;
    }

    const regionName = lang === "cyrillic" ? region.nameCy : region.name;
    const typeInfo = COURT_TYPES.find((t) => t.id === type);
    const typeName = typeInfo ? (lang === "cyrillic" ? typeInfo.nameCy : typeInfo.name) : "";
    await safeEdit(
      `🏛 *${typeName}*\n📍 ${regionName}\n\n${lang === "cyrillic" ? "Sudni tanlang:" : "Sudni tanlang:"}`,
      courtsListKeyboard(type, regionId, courts, lang),
    );
    return true;
  }

  // ── Sud tanlandi → to'liq ma'lumot ──────────────────────────────────────────
  if (data.startsWith("cd:")) {
    const parts = data.split(":");
    const type = parts[1] as CourtType;
    const regionId = parts[2]!;
    const idx = parseInt(parts[3]!);
    const courts = getCourts(type, regionId);
    const court = courts[idx];
    if (!court) return false;

    recordEvent(userId, "courts_detail", `${type}:${regionId}:${idx}`);
    const text = formatCourtInfo(court, lang);
    await deleteLastVenue(bot, userId, chatId);
    await safeEdit(text, courtDetailKeyboard(`cr:${type}:${regionId}`, lang));
    if (court.lat && court.lng) {
      try {
        const cy = lang === "cyrillic";
        const venueName    = cy ? latinToCyrillic(court.name)    : court.name;
        const venueAddress = cy ? latinToCyrillic(court.address) : court.address;
        const sent = await bot.sendVenue(chatId, court.lat, court.lng, venueName, venueAddress);
        lastVenueMsg.set(userId, sent.message_id);
      } catch { /* ignore */ }
    }
    return true;
  }

  return false;
}
