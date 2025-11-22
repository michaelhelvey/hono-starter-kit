import type { Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { ThemeToggle } from "../components/ThemeToggle.js";

export type Theme = "light" | "dark";

export function getTheme(c: Context): Theme {
  const cookieTheme = getCookie(c, "theme") as Theme | undefined;
  return cookieTheme === "light" || cookieTheme === "dark" ? cookieTheme : "dark";
}

export function themeToggleRoute(c: Context) {
  const currentTheme = getTheme(c);
  const newTheme: Theme = currentTheme === "dark" ? "light" : "dark";

  setCookie(c, "theme", newTheme, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    httpOnly: false,
  });

  return c.html(<ThemeToggle theme={newTheme} />);
}
