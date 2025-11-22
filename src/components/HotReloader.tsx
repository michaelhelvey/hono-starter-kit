import { html } from "hono/html";
import { FC } from "hono/jsx";

const IS_DEVELOPMENT = process.env.NODE_ENV !== "production";

export const HotReloader: FC = () => {
  if (!IS_DEVELOPMENT) {
    return null;
  }

  return html`<script>
    let ws = new WebSocket("ws://localhost:3001/ws");
    ws.onopen = function () {
      console.log("live-reload handler connected");
    };
    ws.onerror = function (event) {
      console.error("live-reload handler error", { error: event });
    };
    ws.onclose = function (event) {
      console.log("live-reload handler closed, re-connecting...", { event });
      ws = new WebSocket("ws://localhost:3001/ws");
    };
    ws.onmessage = function (event) {
      const data = JSON.parse(event.data);
      if (data.type === "reload") {
        window.location.reload();
      }
    };
  </script>`;
};
