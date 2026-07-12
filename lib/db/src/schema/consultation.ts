import { pgTable, serial, bigint, text, timestamp } from "drizzle-orm/pg-core";

export const consultationOrdersTable = pgTable("consultation_orders", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number" }).notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type ConsultationOrder = typeof consultationOrdersTable.$inferSelect;
