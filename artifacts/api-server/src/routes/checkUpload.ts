import { Router } from "express";
import multer from "multer";
import crypto from "crypto";
import { ADMIN_ID } from "../bot/config";
import { getBot } from "../bot/index";
import { logger } from "../lib/logger";
import { tgSendPhoto } from "../lib/telegramApi";

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

  try {
    const { username } = getUserInfo(initData);
    const price = "99 000 so'm";
    const caption =
      `📱 *Mini App — To'lov cheki*\n\n` +
      `Xizmat: *Konsultatsiya*\n` +
      `Foydalanuvchi: ${username}\n` +
      `🆔 ID: \`${userId}\`\n` +
      `💰 Summa: *${price}*\n\n` +
      `Tasdiqlash uchun quyidagi tugmalardan birini bosing.`;

    const keyboard = {
      inline_keyboard: [[
        { text: "✅ Tasdiqlash", callback_data: `admin_ok_mc:${userId}` },
        { text: "❌ Rad etish",  callback_data: `admin_no_mc:${userId}` },
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

    logger.info({ userId }, "Mini app chek adminga yuborildi");
    res.json({ ok: true });
  } catch (err) {
    logger.error({ err, userId }, "Chek yuborishda xato");
    res.status(500).json({ error: "send_failed" });
  }
});

export default router;
