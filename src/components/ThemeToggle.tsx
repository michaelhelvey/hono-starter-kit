import { html } from "hono/html";
import { FC } from "hono/jsx";
import type { Theme } from "../lib/theme.js";

export const ThemeToggle: FC<{ theme: Theme }> = ({ theme }) => {
  const isDark = theme === "dark";
  const icon = isDark ? "sun" : "moon";

  return (
    <div id="theme-toggle-container">
      <button
        class="w-10 h-10 text-foreground hover:text-primary transition-colors duration-200"
        hx-post="/api/theme/toggle"
        hx-swap="outerHTML"
        hx-target="#theme-toggle-container"
      >
        <i data-lucide={icon}></i>
      </button>
      {html`<script>
        document.documentElement.className = "${theme}";
      </script>`}
    </div>
  );
};

