import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db, schema } from "@opc/db";
import { writeAudit } from "../audit.js";

export const callbacksRouter = new Hono();

const arkclawCallbackBody = z.object({
  run_id: z.string().uuid(),
  arkclaw_run_id: z.string().optional(),
  status: z.enum(["running", "succeeded", "failed", "cancelled"]),
  output: z.unknown().optional(),
  logs: z.array(z.record(z.unknown())).optional(),
  error_message: z.string().optional(),
  tokens_used: z.number().int().nonnegative().optional(),
  started_at: z.string().datetime().optional(),
  finished_at: z.string().datetime().optional(),
});

/**
 * POST /v1/callbacks/arkclaw — ArkClaw 侧执行结果回调
 *
 * 幂等：以 run_id + status 为键，重复回调以最后一次为准。
 */
callbacksRouter.post("/arkclaw", zValidator("json", arkclawCallbackBody), async (c) => {
  const body = c.req.valid("json");

  const existing = await db.query.taskRuns.findFirst({
    where: eq(schema.taskRuns.id, body.run_id),
  });
  if (!existing) {
    return c.json({ error: "run_not_found" }, 404);
  }

  await db
    .update(schema.taskRuns)
    .set({
      status: body.status,
      arkclawRunId: body.arkclaw_run_id ?? existing.arkclawRunId,
      output: body.output ?? existing.output,
      logs: body.logs ?? existing.logs,
      errorMessage: body.error_message ?? existing.errorMessage,
      tokensUsed: body.tokens_used ?? existing.tokensUsed,
      startedAt: body.started_at ? new Date(body.started_at) : existing.startedAt,
      finishedAt: body.finished_at ? new Date(body.finished_at) : existing.finishedAt,
    })
    .where(eq(schema.taskRuns.id, body.run_id));

  // 当 run 终态时，把 task 表的状态/输出同步过去
  if (["succeeded", "failed", "cancelled"].includes(body.status)) {
    await db
      .update(schema.tasks)
      .set({
        status: body.status === "succeeded" ? "succeeded" : body.status,
        output: body.status === "succeeded" ? (body.output ?? null) : null,
        finishedAt: new Date(),
      })
      .where(eq(schema.tasks.id, existing.taskId));
  }

  await writeAudit({
    workspaceId: existing.workspaceId,
    actorType: "arkclaw",
    action: "run.callback",
    targetType: "task_run",
    targetId: body.run_id,
    payload: { status: body.status, tokens_used: body.tokens_used ?? 0 },
  });

  return c.json({ ok: true });
});
