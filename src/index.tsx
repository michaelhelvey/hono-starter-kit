import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import "dotenv/config";
import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { secureHeaders } from "hono/secure-headers";
import { appendTrailingSlash } from "hono/trailing-slash";
import { db } from "./db/index.js";
import { runMigrations, seedDatabase } from "./db/migrate.js";
import { notifyLiveReloadListeners } from "./lib/live-reloader.js";
import { themeToggleRoute } from "./lib/theme.js";
import { getLogger } from "./logger.js";
import { apacheLogger, postcssMiddleware } from "./middleware/index.js";
import { homeRoute } from "./pages/home.js";

const app = new Hono()
  .use(apacheLogger(getLogger("request")))
  .use(appendTrailingSlash())
  .use(bodyLimit({ maxSize: 1024 * 10 }))
  .use(secureHeaders())
  .use(postcssMiddleware)
  .use(serveStatic({ root: "./public" }))
  .post("/api/theme/toggle", themeToggleRoute)
  .get("/", homeRoute);

export type AppType = typeof app;
export { app };

if (import.meta.main) {
  await runMigrations(db);
  await seedDatabase(db);
  notifyLiveReloadListeners();

  const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
  serve({
    fetch: app.fetch,
    port,
  });
}
