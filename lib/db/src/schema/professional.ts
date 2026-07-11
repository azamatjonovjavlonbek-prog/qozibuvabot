import { pgTable, serial, bigint, text, integer, timestamp } from "drizzle-orm/pg-core";

export const professionalRequestsTable = pgTable("professional_requests", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number" }).notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("pending"),
  price: integer("price"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type ProfessionalRequest = typeof professionalRequestsTable.$inferSelect;
