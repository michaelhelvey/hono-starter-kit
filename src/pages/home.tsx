import type { Context } from "hono";
import { Layout } from "../components/Layout.js";
import { ThemeToggle } from "../components/ThemeToggle.js";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { getTheme } from "../lib/theme.js";

export async function homeRoute(c: Context) {
  const theme = getTheme(c);
  const allUsers = await db.select().from(users);

  return c.html(
    <Layout theme={theme}>
      <main class="w-full h-full bg-background">
        <nav class="container mx-auto p-4 flex justify-between items-center">
          <a href="/" class="text-2xl font-bold">
            hono-starter-kit
          </a>
          <ThemeToggle theme={theme} />
        </nav>
        <div class="container mx-auto p-4">
          <h1 class="text-5xl font-bold">Hello, Hono!</h1>
          <p class="text-lg my-4">
            This is a simple fullstack TypeScript starter template built with Hono, Bun, and
            server-side JSX. Edit src/pages/home.tsx to get started.
          </p>
          <section>
            <h2 class="text-2xl font-bold mb-2">Users</h2>
            <p class="mb-4">
              This section demonstrates that the database is working by fetching all users from the
              database.
            </p>
            <ul class="list-disc list-inside">
              {allUsers.map((user) => (
                <li key={user.id}>
                  {user.id}: {user.username}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </Layout>,
  );
}
