import { sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  serial,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable(
    "users",
    {
      id: serial("id").primaryKey(),
      displayId: varchar("display_name", { length: 50 }).notNull().unique(),
    },
    (table) => ({
      displayIdIndex: index("displayId_index").on(table.displayId),
    }),
  );
export const messagesTable = pgTable(
    "message",
    {
        id:serial("id").primaryKey(),
        content: varchar("content", { length: 280 }).notNull(),
        senderId: varchar("senderId", { length: 50 })
        .notNull()
        .references(() => usersTable.displayId, {
            onDelete: "cascade",
            onUpdate: "cascade",
        }),
        receiverId:varchar("receiverId", { length: 50 })
        .notNull()
        .references(() => usersTable.displayId, {
            onDelete: "cascade",
            onUpdate: "cascade",
        }),
        createdAt: timestamp("created_at").default(sql`now()`),
    },
    (table) =>({
        senderId:index("senderId_index").on(table.senderId),
        receiverId:index("receiverId_index").on(table.receiverId),
    }),
);
export const talksTable =pgTable(
    "talks",
    {
        id:serial("id").primaryKey(),
        user1: varchar("user1", { length: 50 })
        .notNull(),
        user2: varchar("user2", { length: 50 })
        .notNull(),
        lastMessage:varchar("lastMessage", { length: 280 }).notNull(),
        lastUpdate: timestamp("created_at").default(sql`now()`),
    },
    (table) => ({
        uniqCombination: unique().on(table.user1, table.user2),
      }),
)