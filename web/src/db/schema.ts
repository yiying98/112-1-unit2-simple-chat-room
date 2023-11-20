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
      // It is a good idea to set a maximum length for varchars, so that you don't
      // waste space in the database. It is also a good idea to move as much constraints
      // to the database as possible, so that you don't have to worry about them in
      // your application code.
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
        senderId: varchar("user_handle", { length: 50 })
        .notNull()
        .references(() => usersTable.handle, {
            onDelete: "cascade",
            onUpdate: "cascade",
        }),
        receiverId:varchar("user_handle", { length: 50 })
        .notNull()
        .references(() => usersTable.handle, {
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
        user1: varchar("user_handle", { length: 50 })
        .notNull(),
        user2: varchar("user_handle", { length: 50 })
        .notNull(),
        lastUpdate: timestamp("created_at").default(sql`now()`),
    },
    (table) => ({
        uniqCombination: unique().on(table.user1, table.user2),
      }),
)