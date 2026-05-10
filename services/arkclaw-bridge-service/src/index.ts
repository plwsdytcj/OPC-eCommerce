import { serve } from "@hono/node-server";
import { app } from "./app";
import { startRunPoller } from "./workers/run-poller";

const port = Number(process.env.ARKCLAW_BRIDGE_PORT ?? 4001);
const runPollerEnabled = (process.env.RUN_POLLER_ENABLED ?? "true") !== "false";

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`[arkclaw-bridge] listening on http://localhost:${info.port}`);
  if (runPollerEnabled) startRunPoller();
});
