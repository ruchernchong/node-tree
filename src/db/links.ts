import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "./auth";

export const link = sqliteTable("link", {
  id: text().primaryKey(),
  userId: text()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  slug: text().notNull(),
  title: text().notNull(),
  url: text().notNull(),
  icon: text(),
  description: text(),
  order: integer().notNull().default(0),
  isActive: integer({ mode: "boolean" }).default(true).notNull(),
  category: text(),
  startDate: integer({ mode: "timestamp_ms" }),
  endDate: integer({ mode: "timestamp_ms" }),
  createdAt: integer({ mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer({ mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => new Date())
    .notNull(),
});

export const profileSettings = sqliteTable("profile_settings", {
  id: text().primaryKey(),
  userId: text()
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  displayName: text().notNull(),
  bio: text(),
  theme: text().notNull().default("dark"),
  customStyles: text(),
  createdAt: integer({ mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer({ mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => new Date())
    .notNull(),
});

export const clickEvent = sqliteTable("click_event", {
  id: text().primaryKey(),
  linkId: text()
    .notNull()
    .references(() => link.id, { onDelete: "cascade" }),
  userHash: text(),
  referrer: text(),
  device: text(),
  browser: text(),
  country: text(),
  clickedAt: integer({ mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
});
