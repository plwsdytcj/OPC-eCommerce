import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { runsRouter } from "./routes/runs.js";
import { callbacksRouter } from "./routes/callbacks.js";

export const app = new Hono();

app.use("*", logger());
app.use("*", cors({ origin: "*" }));

app.get("/health", (c) =>
  c.json({ ok: true, service: "arkclaw-bridge", time: new Date().toISOString() }),
);

app.route("/v1/runs", runsRouter);
app.route("/v1/callbacks", callbacksRouter);

app.notFound((c) => c.json({ error: "not_found", path: c.req.path }, 404));
app.onError((err, c) => {
  console.error("[arkclaw-bridge] unhandled error:", err);
  return c.json({ error: "internal_error", message: err.message }, 500);
});
