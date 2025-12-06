import { randomBytes } from "node:crypto";
import { Context } from "hono";
import { getSignedCookie, setSignedCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { InferOutput } from "valibot";
import * as v from "valibot";
import { userSelectSchema } from "../db/schema.js";
import { getLogger } from "../logger.js";

function generateCsrfToken() {
  return randomBytes(32).toString("hex");
}

// these are the values that we expect to be stored in the session.  you can
// extend this schema to place any additional values that you want to store in
// the session
const sessionMiddlewareVariablesSchema = v.object({
  user: v.optional(userSelectSchema),
  csrfToken: v.optional(v.string(), generateCsrfToken),
});

function newBlankSession() {
  return v.parse(sessionMiddlewareVariablesSchema, {});
}

export type SessionMiddlewareVariables = InferOutput<typeof sessionMiddlewareVariablesSchema>;

const SIGNING_SECRET = process.env.SIGNING_SECRET ?? "test-signing-secret";
const SESSION_COOKIE_NAME = "_session";
if (process.env.NODE_ENV === "production" && !process.env.SIGNING_SECRET) {
  throw new Error("process.env.SIGNING_SECRET is required in production");
}

async function maybeReadSession(
  c: Context<{ Variables: { session: SessionMiddlewareVariables } }>,
) {
  const logger = getLogger("session");
  const sessionCookie = await getSignedCookie(c, SIGNING_SECRET, SESSION_COOKIE_NAME);
  if (!sessionCookie) {
    c.set("session", newBlankSession());
    return;
  }

  const validatedSession = v.safeParse(
    sessionMiddlewareVariablesSchema,
    JSON.parse(Buffer.from(sessionCookie).toString("utf-8")),
  );

  if (!validatedSession.success) {
    logger.warn("invalid session schema detected, resetting user session");
    c.set("session", newBlankSession());
    return;
  }

  c.set("session", validatedSession.output);
}

async function writeSession(c: Context<{ Variables: { session: SessionMiddlewareVariables } }>) {
  const encodedSession = Buffer.from(JSON.stringify(c.get("session"))).toString("base64");
  await setSignedCookie(c, SESSION_COOKIE_NAME, encodedSession, SIGNING_SECRET);
}

export const sessionMiddleware = createMiddleware<{
  Variables: { session: SessionMiddlewareVariables };
}>(async (c, next) => {
  await maybeReadSession(c);
  await next();
  await writeSession(c);
});
