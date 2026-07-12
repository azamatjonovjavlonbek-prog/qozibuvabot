import { Router } from "express";
import { db, consultationOrdersTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { logger } from "../lib/logger";
import { resolveUserId } from "../lib/initData";

const router = Router();
const botToken = () => process.env.TELEGRAM_BOT_TOKEN ?? "";
const isDev = () => process.env.NODE_ENV !== "production";

router.get("/consultation/my-orders", async (req, res) => {
  const initData = (req.headers["x-init-data"] as string) ?? "";
  const { userId } = resolveUserId(initData, botToken(), isDev());

  if (!userId && userId !== 0) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }

  try {
    const orders = await db
      .select()
      .from(consultationOrdersTable)
      .where(eq(consultationOrdersTable.userId, userId))
      .orderBy(desc(consultationOrdersTable.createdAt))
      .limit(20);

    res.json({ orders });
  } catch (err) {
    logger.error({ err, userId }, "consultation my-orders DB xatosi");
    res.status(500).json({ error: "db_error" });
  }
});

export default router;
