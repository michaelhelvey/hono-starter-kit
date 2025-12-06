import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createSelectSchema } from "drizzle-valibot";
import { v7 } from "uuid";

export const users = sqliteTable("users", {
  id: text().primaryKey().$defaultFn(v7),
  username: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const userSelectSchema = createSelectSchema(users);
