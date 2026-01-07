import {
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const sentimentEnum = pgEnum("sentiment", [
  "positive",
  "neutral",
  "negative",
]);

// Users table - Vercelians who sign in
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  vercelId: text("vercel_id").notNull().unique(),
  username: text("username").notNull().unique(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  avatarUrl: text("avatar_url"),
  role: text("role"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Feedback table
export const feedback = pgTable("feedback", {
  id: uuid("id").primaryKey().defaultRandom(),
  recipientId: uuid("recipient_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  sentiment: sentimentEnum("sentiment").notNull(),
  comment: text("comment").notNull(),
  isAnonymous: boolean("is_anonymous").default(true).notNull(),
  submitterName: text("submitter_name"),
  submitterEmail: text("submitter_email"),
  submitterVercelId: text("submitter_vercel_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Sessions table
export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  feedbackReceived: many(feedback),
  sessions: many(sessions),
}));

export const feedbackRelations = relations(feedback, ({ one }) => ({
  recipient: one(users, {
    fields: [feedback.recipientId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Feedback = typeof feedback.$inferSelect;
export type NewFeedback = typeof feedback.$inferInsert;
export type Session = typeof sessions.$inferSelect;
