import { pgTable, timestamp, uuid, text, unique } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  name: text("name").notNull().unique(),
});

export type User = typeof users.$inferSelect;

export const feeds = pgTable("feeds", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  name: text("name").notNull().unique(),
  url: text("url").notNull().unique(),
  user_id : uuid("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull()
});

export type Feed = typeof feeds.$inferSelect;

export const feedsFollows = pgTable("feeds_follows", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  user_id : uuid("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  feed_id : uuid("feed_id").references(() => feeds.id, { onDelete: 'cascade' }).notNull()
},
(feeds_follows) => [
  unique().on(feeds_follows.user_id, feeds_follows.feed_id),
]);
