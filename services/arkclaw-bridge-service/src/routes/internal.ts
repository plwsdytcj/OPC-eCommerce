import { Hono } from "hono";
import { pollOnce } from "../workers/run-poller";

export const internalRouter = new Hono();

/**
 * POST /internal/run-poller/sweep — 手动触发一次 stuck-run 扫描
 * （方便联调；生产应放到 admin 域名 + 鉴权后）
 */
internalRouter.post("/run-poller/sweep", async (c) => {
  const result = await pollOnce();
  return c.json({ ok: true, ...result });
});
