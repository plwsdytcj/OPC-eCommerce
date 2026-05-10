import { serve } from "@hono/node-server";
import { app } from "./app.js";

const port = Number(process.env.ARKCLAW_BRIDGE_PORT ?? 4001);

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`[arkclaw-bridge] listening on http://localhost:${info.port}`);
});
