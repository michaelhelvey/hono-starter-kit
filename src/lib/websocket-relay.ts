import assert from "node:assert";
import { serve } from "@hono/node-server";
import { createNodeWebSocket } from "@hono/node-ws";
import { Hono } from "hono";
import type { WSContext } from "hono/ws";
import { WebSocket } from "ws";
import { getLogger } from "../logger.js";

const logger = getLogger("websocket-relay");
const IS_DEVELOPMENT = process.env.NODE_ENV !== "production";

const listeners = new Set<WebSocket>();

const app = new Hono();

const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app });

app.get(
  "/ws",
  upgradeWebSocket(() => {
    return {
      onOpen(_event: Event, ws: WSContext<WebSocket>) {
        if (IS_DEVELOPMENT) {
          assert(ws.raw, "ws.raw is undefined");
          listeners.add(ws.raw);
          logger.info("live-reload handler connected", {
            listenerCount: listeners.size,
          });
        }
      },
      onClose(_event: CloseEvent, ws: WSContext<WebSocket>) {
        if (IS_DEVELOPMENT) {
          assert(ws.raw, "ws.raw is undefined");
          listeners.delete(ws.raw);
          logger.info("live-reload handler disconnected", {
            listenerCount: listeners.size,
          });
        }
      },
    };
  }),
);

app.post("/notify", async (c) => {
  if (IS_DEVELOPMENT) {
    logger.info("notifying live-reload listeners", {
      listenerCount: listeners.size,
    });
    for (const ws of listeners) {
      ws.send(JSON.stringify({ type: "reload" }));
    }
    return c.json({ success: true, notified: listeners.size });
  }
  return c.json({ success: false });
});

if (import.meta.main) {
  const port = process.env.WS_RELAY_PORT ? parseInt(process.env.WS_RELAY_PORT) : 3001;
  const server = serve({
    fetch: app.fetch,
    port,
  });
  injectWebSocket(server);
  logger.info(`websocket relay server started on port ${port}`);
}
