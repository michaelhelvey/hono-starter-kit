import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { describe, expect, it } from "vitest";
import { sessionMiddleware } from "../middleware/session.js";

describe("session middleware", () => {
  it("given no session cookie on the request, sets a new blank session", async () => {
    let cookieValue: string | undefined = undefined;
    let sessionObject: Record<string, unknown> = {};

    const app = new Hono();
    app.use(sessionMiddleware).get("/test", async (c) => {
      cookieValue = getCookie(c, "_session");
      sessionObject = c.var.session;
      return c.text("yay");
    });

    await app.request("/test");
    expect(cookieValue).toBeUndefined();
    expect(sessionObject).toMatchObject({
      csrfToken: expect.any(String),
    });
  });

  // note that it's pretty hard to test anything else as we can't actually set
  // the cookie header from `fetch` requests, so we're just depending on e2e
  // tests for the rest of it
});
