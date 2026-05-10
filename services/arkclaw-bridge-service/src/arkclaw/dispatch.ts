import { eq } from "drizzle-orm";
import { db, schema } from "@opc/db";
import { writeAudit } from "../audit.js";

type TaskRun = typeof schema.taskRuns.$inferSelect;

const ARKCLAW_API_BASE = process.env.ARKCLAW_API_BASE ?? "";
const ARKCLAW_API_KEY = process.env.ARKCLAW_API_KEY ?? "";
const ARKCLAW_CALLBACK_BASE = process.env.ARKCLAW_CALLBACK_BASE ?? "http://localhost:4001";
const USE_MOCK = !ARKCLAW_API_BASE || !ARKCLAW_API_KEY;

/**
 * 把 task_run 派发到 ArkClaw。
 *
 * MVP 占位实现：
 * - 若未配置 ArkClaw 凭据，使用 mock 路径（直接 setTimeout 回调一个成功结果）
 * - 配置后改为真实 HTTP 调用，等待 ArkClaw 异步回调
 */
export async function dispatchToArkclaw(run: TaskRun): Promise<void> {
  // mark running
  await db
    .update(schema.taskRuns)
    .set({ status: "running", startedAt: new Date() })
    .where(eq(schema.taskRuns.id, run.id));

  await db
    .update(schema.tasks)
    .set({ status: "running" })
    .where(eq(schema.tasks.id, run.taskId));

  await writeAudit({
    workspaceId: run.workspaceId,
    actorType: "system",
    action: "run.dispatch",
    targetType: "task_run",
    targetId: run.id,
    payload: { mock: USE_MOCK },
  });

  if (USE_MOCK) {
    await mockArkclawDispatch(run);
    return;
  }

  await realArkclawDispatch(run);
}

async function mockArkclawDispatch(run: TaskRun): Promise<void> {
  // 模拟 1.5s 后回调成功
  setTimeout(() => {
    void fetch(`${ARKCLAW_CALLBACK_BASE}/v1/callbacks/arkclaw`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        run_id: run.id,
        arkclaw_run_id: `mock_${Date.now()}`,
        status: "succeeded",
        output: {
          mock: true,
          summary: "This is a mock ArkClaw response. Replace with real call.",
          input_echo: run.input,
        },
        logs: [
          { ts: new Date().toISOString(), level: "info", msg: "mock dispatch start" },
          { ts: new Date().toISOString(), level: "info", msg: "mock dispatch done" },
        ],
        tokens_used: 0,
        started_at: new Date().toISOString(),
        finished_at: new Date().toISOString(),
      }),
    }).catch((err) => console.error("[arkclaw-bridge] mock callback failed:", err));
  }, 1500);
}

async function realArkclawDispatch(run: TaskRun): Promise<void> {
  const callbackUrl = `${ARKCLAW_CALLBACK_BASE}/v1/callbacks/arkclaw`;

  const resp = await fetch(`${ARKCLAW_API_BASE}/runs`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${ARKCLAW_API_KEY}`,
    },
    body: JSON.stringify({
      external_run_id: run.id,
      input: run.input,
      callback_url: callbackUrl,
    }),
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    await db
      .update(schema.taskRuns)
      .set({
        status: "failed",
        errorMessage: `arkclaw_dispatch_failed: ${resp.status} ${text}`.slice(0, 500),
        finishedAt: new Date(),
      })
      .where(eq(schema.taskRuns.id, run.id));
    return;
  }

  const body = (await resp.json().catch(() => ({}))) as { run_id?: string };
  if (body.run_id) {
    await db
      .update(schema.taskRuns)
      .set({ arkclawRunId: body.run_id })
      .where(eq(schema.taskRuns.id, run.id));
  }
}
