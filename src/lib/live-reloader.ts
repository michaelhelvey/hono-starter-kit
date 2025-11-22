import { getLogger } from "../logger.js";

const logger = getLogger("live-reloader");
const IS_DEVELOPMENT = process.env.NODE_ENV !== "production";

const RELAY_PORT = process.env.WS_RELAY_PORT ? parseInt(process.env.WS_RELAY_PORT) : 3001;
const RELAY_URL = `http://localhost:${RELAY_PORT}/notify`;

export function notifyLiveReloadListeners() {
  if (IS_DEVELOPMENT) {
    fetch(RELAY_URL, {
      method: "POST",
    }).catch((error) => {
      logger.error("failed to notify live-reload relay", { error });
    });
  }
}
