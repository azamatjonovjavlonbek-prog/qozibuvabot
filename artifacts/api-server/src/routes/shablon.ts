import { Router } from "express";
import multer from "multer";
import { db, shablonOrdersTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { ADMIN_ID } from "../bot/config";
import { getBot } from "../bot/index";
import { logger } from "../lib/logger";
import { resolveUserId, displayName } from "../lib/initData";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const botToken = () => process.env.TELEGRAM_BOT_TOKEN ?? "";
const isDev = () => process.env.NODE_ENV !== "production";

const CAT_LABELS: Record<string, string> = {
  divorce: "Nikohdan ajratish arizasi",
  aliment: "Aliment undirish arizasi",
  radar:   "Multiradar jarima bekor qilish",
};

router.post("/shablon/pay", upload.single("file"), async (req, res) => {
  const { initData = "", catId = "" } = req.body as { initData?: string; catId?: string };
  const file = req.file;

  if (!file) { res.status(400).json({ error: "file_required" }); return; }
  if (!catId || !CAT_LABELS[catId]) { res.status(400).json({ error: "invalid_cat" }); return; }

  const { userId, user } = resolveUserId(initData, botToken(), isDev());
  if (!userId && userId !== 0) { res.status(401).json({ error: "unauthorized" }); return; }

  const catLabel = CAT_LABELS[catId]!;

  let orderId: number;
  try {
    const [inserted] = await db.insert(shablonOrdersTable).values({
      userId,
      catId,
      catLabel,
      status: "pending",
    }).returning({ id: shablonOrdersTable.id });
    orderId = inserted!.id;
  } catch (err) {
    logger.error({ err }, "Shablon order DB ga saqlanmadi");
    res.status(500).json({ error: "db_error" });
    return;
  }

  try {
    const userName = displayName(user);
    const price = "29 000 so'm";
    const now = new Date().toLocaleString("uz-UZ", { timeZone: "Asia/Tashkent" });

    const caption =
      `📄 *Mini App — Shablon ariza to'lov cheki*\n\n` +
      `👤 Foydalanuvchi: ${userName}\n` +
      `🆔 ID: \`${userId}\`\n` +
      `📝 Ariza: *${catLabel}*\n` +
      `💰 Summa: *${price}*\n` +
      `🕐 Vaqt: ${now}\n\n` +
      `Tasdiqlash uchun tugmani bosing.`;

    const keyboard = {
      inline_keyboard: [[
        { text: "✅ Tasdiqlash", callback_data: `admin_ok_s:${userId}:${catId}` },
        { text: "❌ Rad etish",  callback_data: `admin_no:${userId}` },
      ]],
    };

    // Bot instance orqali yuborish (Railway), aks holda Telegram HTTP API orqali (Replit)
    const bot = getBot();
    if (bot) {
      await bot.sendPhoto(ADMIN_ID, file.buffer, {
        caption,
        parse_mode: "Markdown",
        reply_markup: keyboard,
      });
    } else {
      // To'g'ridan Telegram HTTP API orqali yuborish
      const token = botToken();
      const form = new FormData();
      form.append("chat_id", String(ADMIN_ID));
      form.append("caption", caption);
      form.append("parse_mode", "Markdown");
      form.append("reply_markup", JSON.stringify(keyboard));
      form.append("photo", new Blob([new Uint8Array(file.buffer)], { type: file.mimetype }), file.originalname || "check.jpg");
      const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
        method: "POST",
        body: form,
      });
      if (!tgRes.ok) {
        const err = await tgRes.text();
        logger.error({ err, userId }, "Telegram API orqali adminga yuborishda xato");
      }
    }

    logger.info({ userId, catId, orderId }, "Shablon ariza cheki adminga yuborildi");
  } catch (err) {
    logger.error({ err, userId }, "Adminga yuborishda xato");
  }

  res.json({ ok: true, orderId });
});

router.get("/shablon/my-orders", async (req, res) => {
  const initData = (req.headers["x-init-data"] as string) ?? "";
  const { userId } = resolveUserId(initData, botToken(), isDev());

  if (!userId && userId !== 0) { res.status(401).json({ error: "unauthorized" }); return; }

  try {
    const orders = await db
      .select()
      .from(shablonOrdersTable)
      .where(eq(shablonOrdersTable.userId, userId))
      .orderBy(desc(shablonOrdersTable.createdAt))
      .limit(20);

    res.json({ orders });
  } catch (err) {
    logger.error({ err, userId }, "shablon my-orders DB xatosi");
    res.status(500).json({ error: "db_error" });
  }
});

export default router;
