import { and, eq, lt, sql } from "drizzle-orm";
import { db, schema } from "@opc/db";
import { writeAudit } from "../audit";

const ARKCLAW_API_BASE = process.env.ARKCLAW_API_BASE ?? "";
const ARKCLAW_API_KEY = process.env.ARKCLAW_API_KEY ?? "";
const PLACEHOLDER = new Set(["", "replace-me", "MOCK", "mock"]);
const USE_MOCK =
  PLACEHOLDER.has(ARKCLAW_API_KEY) ||
  PLACEHOLDER.has(ARKCLAW_API_BASE) ||
  ARKCLAW_API_BASE.includes("example.com");

const POLL_INTERVAL_MS = Number(process.env.RUN_POLLER_INTERVAL_MS ?? 30_000);
// 多久没回调就主动 poll（默认 2 分钟）
const STALE_AFTER_MS = Number(process.env.RUN_POLLER_STALE_MS ?? 2 * 60 * 1000);
// 多久没回调就直接判失败（默认 30 分钟）
const TIMEOUT_AFTER_MS = Number(process.env.RUN_POLLER_TIMEOUT_MS ?? 30 * 60 * 1000);

let timer: NodeJS.Timeout | null = null;
let busy = false;

/**
 * 启动一个轮询兜底：
 * - 每 POLL_INTERVAL_MS 扫一次 status='running' 的 run
 * - 超过 STALE_AFTER_MS 还没回调 → 主动调 ArkClaw GET /runs/:arkclaw_run_id（mock 模式跳过）
 * - 超过 TIMEOUT_AFTER_MS 还在 running → 直接打 failed，写审计 run.timeout
 */
export function startRunPoller(): void {
  if (timer) return;
  console.log(
    `[run-poller] enabled, interval=${POLL_INTERVAL_MS}ms stale=${STALE_AFTER_MS}ms timeout=${TIMEOUT_AFTER_MS}ms mock=${USE_MOCK}`,
  );
  timer = setInterval(() => {
    if (busy) return;
    busy = true;
    pollOnce()
      .catch((err) => console.error("[run-poller] sweep failed:", err))
      .finally(() => {
        busy = false;
      });
  }, POLL_INTERVAL_MS);
  // 让 process 退出时自动清理
  if (typeof timer.unref === "function") timer.unref();
}

export function stopRunPoller(): void {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

/** 给测试 / 手动触发用，外部可调用 */
export async function pollOnce(): Promise<{ checked: number; timed_out: number; resolved: number }> {
  const staleCutoff = new Date(Date.now() - STALE_AFTER_MS);
  const timeoutCutoff = new Date(Date.now() - TIMEOUT_AFTER_MS);

  const stuck = await db
    .select()
    .from(schema.taskRuns)
    .where(
      and(
        eq(schema.taskRuns.status, "running"),
        lt(schema.taskRuns.startedAt, staleCutoff),
      ),
    )
    .limit(50);

  let timedOut = 0;
  let resolved = 0;

  for (const run of stuck) {
    const startedAt = run.startedAt ?? run.createdAt;
    if (startedAt && startedAt < timeoutCutoff) {
      await markTimedOut(run);
      timedOut += 1;
      continue;
    }

    if (USE_MOCK) {
      // mock 模式下没东西可 poll，等下一轮
      continue;
    }

    const ok = await tryPollArkclaw(run);
    if (ok) resolved += 1;
  }

  if (stuck.length > 0) {
    console.log(
      `[run-poller] swept ${stuck.length} stale run(s): timed_out=${timedOut} resolved=${resolved}`,
    );
  }
  return { checked: stuck.length, timed_out: timedOut, resolved };
}

async function markTimedOut(run: typeof schema.taskRuns.$inferSelect): Promise<void> {
  await db
    .update(schema.taskRuns)
    .set({
      status: "failed",
      errorMessage: "run_timeout: no callback received within deadline",
      finishedAt: new Date(),
    })
    .where(eq(schema.taskRuns.id, run.id));

  await db
    .update(schema.tasks)
    .set({ status: "failed" })
    .where(eq(schema.tasks.id, run.taskId));

  await writeAudit({
    workspaceId: run.workspaceId,
    actorType: "system",
    action: "run.timeout",
    targetType: "task_run",
    targetId: run.id,
    payload: { started_at: run.startedAt },
  });
}

async function tryPollArkclaw(run: typeof schema.taskRuns.$inferSelect): Promise<boolean> {
  if (!run.arkclawRunId) return false;
  try {
    const resp = await fetch(`${ARKCLAW_API_BASE}/runs/${run.arkclawRunId}`, {
      headers: { authorization: `Bearer ${ARKCLAW_API_KEY}` },
    });
    if (!resp.ok) return false;
    const body = (await resp.json().catch(() => null)) as
      | {
          status?: "succeeded" | "failed" | "running";
          output?: unknown;
          logs?: unknown[];
          error_message?: string;
          tokens_used?: number;
        }
      | null;
    if (!body || !body.status || body.status === "running") return false;

    const isSuccess = body.status === "succeeded";
    await db
      .update(schema.taskRuns)
      .set({
        status: body.status,
        output: (body.output ?? null) as never,
        logs: (body.logs ?? []) as never,
        errorMessage: body.error_message ?? null,
        tokensUsed: body.tokens_used ?? 0,
        finishedAt: new Date(),
      })
      .where(eq(schema.taskRuns.id, run.id));

    await db
      .update(schema.tasks)
      .set({
        status: body.status,
        output: (isSuccess ? body.output : null) as never,
      })
      .where(eq(schema.tasks.id, run.taskId));

    await writeAudit({
      workspaceId: run.workspaceId,
      actorType: "system",
      action: "run.poll",
      targetType: "task_run",
      targetId: run.id,
      payload: { resolved_status: body.status, source: "poller" },
    });
    return true;
  } catch (err) {
    console.error("[run-poller] arkclaw poll failed for run", run.id, err);
    // 不立刻判失败，等下一轮 / TIMEOUT_AFTER_MS 兜底
    return false;
  }
}

// 抑制 unused-warning：sql 用于潜在的 raw 查询，先保留 import
void sql;
