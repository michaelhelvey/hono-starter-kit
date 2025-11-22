import path from "node:path";
import { fileURLToPath } from "node:url";
import { migrate } from "drizzle-orm/libsql/migrator";
import { DatabaseInstance } from "./index.js";
import { users } from "./schema.js";

const projectRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
export async function runMigrations(db: DatabaseInstance) {
  await migrate(db, { migrationsFolder: path.join(projectRoot, "drizzle") });
}

export async function seedDatabase(db: DatabaseInstance) {
  await db
    .insert(users)
    .values({
      name: "John Doe",
      email: "john.doe@example.com",
      createdAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [users.email],
      set: {
        createdAt: new Date(),
      },
    });
}
