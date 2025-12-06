import { html } from "hono/html";
import { FC, Fragment } from "hono/jsx";
import type { Theme } from "../lib/theme.js";
import { HotReloader } from "./HotReloader.js";

export const Layout: FC<{ children: any; theme: Theme }> = ({ children, theme }) => (
  <Fragment>
    {html`<!DOCTYPE html>`}
    <html id="html-root" class={theme}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>hono-starter-kit</title>
        <link rel="stylesheet" href="/generated/globals.css" />
        <script src="/js/htmx.min.js" type="text/javascript"></script>
        <script src="https://unpkg.com/lucide@latest"></script>
      </head>
      <body>{children}</body>
      <HotReloader />
      {html`<script>
        lucide.createIcons();
        htmx.onLoad(function () {
          lucide.createIcons();
        });
      </script>`}
    </html>
  </Fragment>
);
