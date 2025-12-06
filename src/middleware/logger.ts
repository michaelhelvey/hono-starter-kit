import type { Context, Next } from "hono";
import { getLogger } from "../logger.js";

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
