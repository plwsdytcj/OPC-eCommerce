import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db, schema } from "@opc/db";
import { dispatchToArkclaw } from "../arkclaw/dispatch";
import { writeAudit } from "../audit";

export const runsRouter = new Hono();

const createRunBody = z.object({
  workspace_id: z.string().uuid(),
  task_id: z.string().uuid(),
  agent_instance_id: z.string().uuid().optional(),
  input: z.record(z.unknown()).default({}),
  callback_url: z.string().url().optional(),
});

/**
 * POST /v1/runs — 创建一次执行
 */
runsRouter.post("/", zValidator("json", createRunBody), async (c) => {
  const body = c.req.valid("json");

  const [created] = await db
    .insert(schema.taskRuns)
    .values({
      workspaceId: body.workspace_id,
      taskId: body.task_id,
      agentInstanceId: body.agent_instance_id,
      status: "pending",
      input: body.input,
      callbackUrl: body.callback_url,
    })
    .returning();

  if (!created) {
    return c.json({ error: "create_failed" }, 500);
  }

  await writeAudit({
    workspaceId: body.workspace_id,
    actorType: "system",
    action: "run.create",
    targetType: "task_run",
    targetId: created.id,
    payload: { task_id: body.task_id },
  });

  // 派发到 ArkClaw（异步，不阻塞响应）
  void dispatchToArkclaw(created).catch((err) => {
    console.error("[arkclaw-bridge] dispatch failed:", err);
  });

  return c.json(
    {
      run_id: created.id,
      status: created.status,
      created_at: created.createdAt,
    },
    201,
  );
});

/**
 * GET /v1/runs/:id — 查询单次执行
 */
runsRouter.get("/:id", async (c) => {
  const id = c.req.param("id");
  const row = await db.query.taskRuns.findFirst({
    where: eq(schema.taskRuns.id, id),
  });
  if (!row) return c.json({ error: "not_found" }, 404);

  return c.json({
    run_id: row.id,
    task_id: row.taskId,
    workspace_id: row.workspaceId,
    agent_instance_id: row.agentInstanceId,
    status: row.status,
    input: row.input,
    output: row.output,
    logs: row.logs,
    error_message: row.errorMessage,
    tokens_used: row.tokensUsed,
    arkclaw_run_id: row.arkclawRunId,
    started_at: row.startedAt,
    finished_at: row.finishedAt,
    created_at: row.createdAt,
  });
});
