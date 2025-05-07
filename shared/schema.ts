import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const keys = pgTable("keys", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  expiryTime: timestamp("expiry_time").notNull(),
  duration: integer("duration").notNull(), // Duration in minutes
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertKeySchema = createInsertSchema(keys).pick({
  key: true,
  expiryTime: true,
  duration: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertKey = z.infer<typeof insertKeySchema>;
export type Key = typeof keys.$inferSelect;
