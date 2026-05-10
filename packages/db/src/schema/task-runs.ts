import { pgTable, uuid, text, timestamp, jsonb, integer, index } from "drizzle-orm/pg-core";
import { tasks } from "./tasks.js";
import { agentInstances } from "./agent-instances.js";
import { workspaces } from "./workspaces.js";

/**
 * Task Run = 一次具体的执行记录（对应一次 ArkClaw 调用）。
 * 状态机：pending → running → succeeded / failed / cancelled
 * 支持重试：同一个 task 可以有多个 task_runs。
 */
export const taskRuns = pgTable(
  "task_runs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    taskId: uuid("task_id")
      .notNull()
      .references(() => tasks.id, { onDelete: "cascade" }),
    agentInstanceId: uuid("agent_instance_id").references(() => agentInstances.id, {
      onDelete: "set null",
    }),
    /** ArkClaw 侧的执行 ID（用于回调匹配） */
    arkclawRunId: text("arkclaw_run_id"),
    status: text("status").notNull().default("pending"),
    // pending / running / succeeded / failed / cancelled
    input: jsonb("input").notNull().default({}),
    output: jsonb("output"),
    /** 执行日志：[{ ts, level, msg, ... }] */
    logs: jsonb("logs").notNull().default([]),
    errorMessage: text("error_message"),
    tokensUsed: integer("tokens_used").default(0),
    /** 用户回调地址（ArkClaw 侧执行完打回来） */
    callbackUrl: text("callback_url"),
    /** 重试次数 */
    attempt: integer("attempt").notNull().default(1),
    startedAt: timestamp("started_at", { withTimezone: true }),
    finishedAt: timestamp("finished_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    taskIdx: index("task_runs_task_idx").on(table.taskId),
    workspaceIdx: index("task_runs_workspace_idx").on(table.workspaceId),
    statusIdx: index("task_runs_status_idx").on(table.status),
    arkclawIdx: index("task_runs_arkclaw_idx").on(table.arkclawRunId),
  }),
);

export type TaskRun = typeof taskRuns.$inferSelect;
export type NewTaskRun = typeof taskRuns.$inferInsert;
