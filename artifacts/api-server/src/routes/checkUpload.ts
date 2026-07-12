import { Router } from "express";
import multer from "multer";
import crypto from "crypto";
import { ADMIN_ID, CONSULTATION_PHONE, CONSULTATION_HOURS } from "../bot/config";
import { getBot } from "../bot/index";
import { logger } from "../lib/logger";
import { tgSendPhoto, tgSendMessage } from "../lib/telegramApi";
import { db, consultationOrdersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

function validateInitData(initData: string, botToken: string): number | null {
  try {
    const params = new URLSearchParams(initData);
    const hash = params.get("hash");
    if (!hash) return null;
    params.delete("hash");
    const dataCheckString = [...params.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join("\n");
    const secretKey = crypto.createHmac("sha256", "WebAppData").update(botToken).digest();
    const expectedHash = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex");
    if (expectedHash !== hash) return null;
    const userStr = params.get("user");
    if (!userStr) return null;
    const user = JSON.parse(userStr) as { id: number; username?: string; first_name?: string };
    return user.id;
  } catch {
    return null;
  }
}

function getUserInfo(initData: string): { username: string } {
  try {
    const params = new URLSearchParams(initData);
    const userStr = params.get("user");
    if (!userStr) return { username: "Noma'lum" };
    const user = JSON.parse(userStr) as { id: number; username?: string; first_name?: string };
    return { username: user.username ? `@${user.username}` : (user.first_name ?? "Noma'lum") };
  } catch {
    return { username: "Noma'lum" };
  }
}

router.post("/check/upload", upload.single("file"), async (req, res) => {
  const { initData = "" } = req.body as { initData?: string };
  const file = req.file;

  if (!file) {
    res.status(400).json({ error: "file_required" });
    return;
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN ?? "";
  let userId: number | null = null;

  if (initData && botToken) {
    userId = validateInitData(initData, botToken);
  }

  if (!userId && process.env.NODE_ENV !== "production") {
    userId = 0;
  }

  if (!userId && userId !== 0) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }

  // DB ga saqlash
  let orderId: number | null = null;
  try {
    const [inserted] = await db.insert(consultationOrdersTable).values({
      userId,
      status: "pending",
    }).returning({ id: consultationOrdersTable.id });
    orderId = inserted!.id;
  } catch (dbErr) {
    logger.error({ dbErr, userId }, "Konsultatsiya DB ga saqlanmadi");
  }

  try {
    const { username } = getUserInfo(initData);
    const price = "99 000 so'm";
    const caption =
      `📱 *Mini App — Konsultatsiya To'lov Cheki*\n\n` +
      `👤 Foydalanuvchi: ${username}\n` +
      `🆔 ID: \`${userId}\`\n` +
      (orderId ? `📋 Buyurtma: #${orderId}\n` : "") +
      `💰 Summa: *${price}*\n\n` +
      `Tasdiqlash uchun quyidagi tugmalardan birini bosing.`;

    const keyboard = {
      inline_keyboard: [[
        { text: "✅ Tasdiqlash", callback_data: `admin_ok_mc:${userId}:${orderId ?? 0}` },
        { text: "❌ Rad etish",  callback_data: `admin_no_mc:${userId}:${orderId ?? 0}` },
      ]],
    };

    const bot = getBot();
    if (bot) {
      await bot.sendPhoto(ADMIN_ID, file.buffer, {
        caption,
        parse_mode: "Markdown",
        reply_markup: keyboard,
      });
    } else {
      await tgSendPhoto(ADMIN_ID, file.buffer, file.mimetype, file.originalname || "check.jpg", {
        caption,
        parse_mode: "Markdown",
        reply_markup: keyboard,
      });
    }

    logger.info({ userId, orderId }, "Mini app konsultatsiya cheki adminga yuborildi");
    res.json({ ok: true, orderId });
  } catch (err) {
    logger.error({ err, userId }, "Chek yuborishda xato");
    res.status(500).json({ error: "send_failed" });
  }
});

// Admin tomonidan tasdiqlash (Railway bot callback handler qo'ng'iroq qiladi)
router.post("/consultation/approve", async (req, res) => {
  const { orderId, userId, secret } = req.body as { orderId?: number; userId?: number; secret?: string };
  if (secret !== process.env.ADMIN_SECRET) {
    res.status(403).json({ error: "forbidden" });
    return;
  }
  if (!orderId || !userId) {
    res.status(400).json({ error: "missing_fields" });
    return;
  }
  try {
    await db.update(consultationOrdersTable)
      .set({ status: "completed", updatedAt: new Date() })
      .where(eq(consultationOrdersTable.id, orderId));

    const phoneMsg =
      `✅ *To'lovingiz tasdiqlandi!*\n\n` +
      `📞 Yuristimiz telefon raqami:\n*${CONSULTATION_PHONE}*\n\n` +
      `Ish vaqti: *${CONSULTATION_HOURS}*\n` +
      `Qo'ng'iroq qiling — yurist sizga maslahat beradi.`;

    const bot = getBot();
    if (bot) {
      await bot.sendMessage(userId, phoneMsg, { parse_mode: "Markdown" });
    } else {
      await tgSendMessage(userId, phoneMsg, { parse_mode: "Markdown" });
    }

    logger.info({ orderId, userId }, "Konsultatsiya tasdiqlandi");
    res.json({ ok: true });
  } catch (err) {
    logger.error({ err, orderId, userId }, "Consultation approve xato");
    res.status(500).json({ error: "db_error" });
  }
});

export default router;
