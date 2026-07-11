import { Router } from "express";
import multer from "multer";
import { db, professionalRequestsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { ADMIN_ID, CARD_NUMBER, CARD_OWNER } from "../bot/config";
import { getBot } from "../bot/index";
import { logger } from "../lib/logger";
import { resolveUserId, displayName } from "../lib/initData";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 5 },
});

const botToken = () => process.env.TELEGRAM_BOT_TOKEN ?? "";
const isDev = () => process.env.NODE_ENV !== "production";

function priceKeyboard(reqId: number) {
  return {
    inline_keyboard: [
      [
        { text: "50 000",   callback_data: `prof_price:${reqId}:50000` },
        { text: "100 000",  callback_data: `prof_price:${reqId}:100000` },
        { text: "200 000",  callback_data: `prof_price:${reqId}:200000` },
      ],
      [
        { text: "500 000",  callback_data: `prof_price:${reqId}:500000` },
        { text: "1 000 000",callback_data: `prof_price:${reqId}:1000000` },
        { text: "❌ Rad etish", callback_data: `prof_no_req:${reqId}` },
      ],
    ],
  };
}

router.post("/professional/submit", upload.array("files", 5), async (req, res) => {
  const { initData = "", description = "" } = req.body as { initData?: string; description?: string };
  const files = (req.files ?? []) as Express.Multer.File[];

  if (!description.trim() || description.trim().length < 10) {
    res.status(400).json({ error: "description_required" });
    return;
  }

  const { userId, user } = resolveUserId(initData, botToken(), isDev());
  if (!userId && userId !== 0) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }

  let reqId: number;
  try {
    const [inserted] = await db.insert(professionalRequestsTable).values({
      userId: userId,
      description: description.trim(),
      status: "pending",
    }).returning({ id: professionalRequestsTable.id });
    reqId = inserted!.id;
  } catch (err) {
    logger.error({ err }, "Professional ariza DB ga saqlanmadi");
    res.status(500).json({ error: "db_error" });
    return;
  }

  const bot = getBot();
  if (!bot) {
    logger.warn({ userId, reqId }, "Dev: bot yo'q, admin notification o'tkazib yuborildi");
    res.json({ ok: true, reqId });
    return;
  }

  const userName = displayName(user);
  const now = new Date().toLocaleString("uz-UZ", { timeZone: "Asia/Tashkent" });

  try {
    for (const file of files) {
      const isImage = file.mimetype.startsWith("image/");
      if (isImage) {
        await bot.sendPhoto(ADMIN_ID, file.buffer, {
          caption: `📎 Hujjat — Ariza #${reqId}`,
        });
      } else {
        await bot.sendDocument(ADMIN_ID, file.buffer, {
          caption: `📎 Hujjat — Ariza #${reqId}`,
        }, { filename: file.originalname, contentType: file.mimetype });
      }
    }

    const caption =
      `📋 *Professional Ariza So'rovi*\n\n` +
      `👤 Foydalanuvchi: ${userName}\n` +
      `🆔 ID: \`${userId}\`\n` +
      `🕐 Vaqt: ${now}\n` +
      `📎 Fayllar: ${files.length} ta\n\n` +
      `📝 *Masala:*\n${description.trim()}\n\n` +
      `👇 Narxni belgilang (so'm):`;

    await bot.sendMessage(ADMIN_ID, caption, {
      parse_mode: "Markdown",
      reply_markup: priceKeyboard(reqId),
    });

    logger.info({ userId, reqId }, "Professional ariza adminga yuborildi");
  } catch (err) {
    logger.error({ err, userId, reqId }, "Adminga yuborishda xato");
  }

  res.json({ ok: true, reqId });
});

router.get("/professional/my-requests", async (req, res) => {
  const initData = (req.headers["x-init-data"] as string) ?? "";
  const { userId } = resolveUserId(initData, botToken(), isDev());

  if (!userId && userId !== 0) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }

  try {
    const requests = await db
      .select()
      .from(professionalRequestsTable)
      .where(eq(professionalRequestsTable.userId, userId))
      .orderBy(desc(professionalRequestsTable.createdAt))
      .limit(20);

    res.json({ requests });
  } catch (err) {
    logger.error({ err, userId }, "My-requests DB query xatosi");
    res.status(500).json({ error: "db_error" });
  }
});

export { router as professionalRouter };
export default router;
