import { pgTable, serial, bigint, text, timestamp } from "drizzle-orm/pg-core";

export const shablonOrdersTable = pgTable("shablon_orders", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number" }).notNull(),
  catId: text("cat_id").notNull(),
  catLabel: text("cat_label").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type ShablonOrder = typeof shablonOrdersTable.$inferSelect;
