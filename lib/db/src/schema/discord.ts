import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const guildWelcomeSettingsTable = pgTable(
  "guild_welcome_settings",
  {
    id: serial("id").primaryKey(),
    guildId: text("guild_id").notNull().unique(),
    enabled: boolean("enabled").notNull().default(true),
    style: text("style").notNull().default("embed"),
    channelId: text("channel_id"),
    headline: text("headline").notNull().default("أهلًا بك في السيرفر"),
    body: text("body")
      .notNull()
      .default("نورتنا {member}، نتمنى لك وقتًا ممتعًا."),
    accentColor: text("accent_color").notNull().default("#E50914"),
    backgroundUrl: text("background_url"),
    includeInviter: boolean("include_inviter").notNull().default(true),
    autoRoleIds: jsonb("auto_role_ids").$type<string[]>().notNull().default([]),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("guild_welcome_settings_guild_idx").on(table.guildId)],
);

export const welcomeEventsTable = pgTable(
  "welcome_events",
  {
    id: serial("id").primaryKey(),
    guildId: text("guild_id").notNull(),
    memberId: text("member_id").notNull(),
    inviterId: text("inviter_id"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("welcome_events_guild_created_idx").on(
      table.guildId,
      table.createdAt,
    ),
  ],
);

export const discordSessionsTable = pgTable(
  "discord_sessions",
  {
    tokenHash: text("token_hash").primaryKey(),
    discordUserId: text("discord_user_id").notNull(),
    username: text("username").notNull(),
    avatarUrl: text("avatar_url"),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("discord_sessions_expiry_idx").on(table.expiresAt)],
);

export const insertGuildWelcomeSettingsSchema = createInsertSchema(
  guildWelcomeSettingsTable,
).omit({ id: true, updatedAt: true });

export const insertWelcomeEventSchema = createInsertSchema(
  welcomeEventsTable,
).omit({ id: true, createdAt: true });

export type GuildWelcomeSettings = typeof guildWelcomeSettingsTable.$inferSelect;
export type InsertGuildWelcomeSettings = z.infer<
  typeof insertGuildWelcomeSettingsSchema
>;
export type WelcomeEvent = typeof welcomeEventsTable.$inferSelect;
export type InsertWelcomeEvent = z.infer<typeof insertWelcomeEventSchema>;
export type DiscordSession = typeof discordSessionsTable.$inferSelect;