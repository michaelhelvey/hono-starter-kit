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

export function apacheLogger(logger: ReturnType<typeof getLogger>) {
  return async (c: Context, next: Next) => {
    const start = Date.now();
    await next();
    const duration = Date.now() - start;

    const ip =
      c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ||
      c.req.header("x-real-ip") ||
      "127.0.0.1";
    const method = c.req.method;
    const path = c.req.path;
    const protocol = c.req.header("x-forwarded-proto") || "HTTP/1.1";
    const status = c.res.status;
    const referer = c.req.header("referer") || "-";
    const userAgent = c.req.header("user-agent") || "-";
    const contentLength = c.res.headers.get("content-length") || "-";

    const logLine = `${ip} - - "${method} ${path} ${protocol}" ${status} ${contentLength} "${referer}" "${userAgent}" ${duration}ms`;
    logger.info(logLine);
  };
}

