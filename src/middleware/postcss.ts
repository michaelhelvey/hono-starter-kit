import { readFile } from "node:fs/promises";
import { join } from "node:path";
import tailwindcss from "@tailwindcss/postcss";
import type { Context, Next } from "hono";
import postcss from "postcss";
import { getLogger } from "../logger.js";

const isDevelopment = process.env.NODE_ENV !== "production";

export async function postcssMiddleware(c: Context, next: Next) {
  const logger = getLogger("postcss");
  if (!isDevelopment || c.req.path !== "/generated/globals.css") {
    return next();
  }

  try {
    const sourcePath = join(process.cwd(), "src", "globals.css");
    const sourceCss = await readFile(sourcePath, "utf-8");

    const result = await postcss([tailwindcss()]).process(sourceCss, {
      from: sourcePath,
    });

    return c.text(result.css, 200, {
      "Content-Type": "text/css",
      "Cache-Control": "no-cache",
    });
  } catch (error) {
    logger.error("PostCSS compilation error:", { error });
    return c.text(
      `/* PostCSS Error: ${error instanceof Error ? error.message : String(error)} */`,
      500,
      {
        "Content-Type": "text/plain",
      },
    );
  }
}
