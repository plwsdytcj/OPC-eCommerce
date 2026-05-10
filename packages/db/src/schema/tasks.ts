import { pgTable, uuid, text, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { workspaces } from "./workspaces.js";
import { agentInstances } from "./agent-instances.js";

/**
 * Task = 用户创建的经营任务（业务对象）。
 * 一个 task 可能会触发一个或多个 task_runs（执行记录）。
 */
export const tasks = pgTable(
  "tasks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    type: text("type").notNull(), // listing / sourcing / content / finance / market / ...
    /** 分配给的员工实例（可空，未分配状态） */
    assignedAgentId: uuid("assigned_agent_id").references(() => agentInstances.id, {
      onDelete: "set null",
    }),
    /** Workflow 关联（可空，单任务不属于任何 Workflow） */
    workflowRunId: uuid("workflow_run_id"),
    status: text("status").notNull().default("pending"),
    // pending / running / waiting_confirm / succeeded / failed / cancelled
    priority: text("priority").notNull().default("normal"), // low / normal / high
    /** 任务输入（用户填写或 workflow 注入） */
    input: jsonb("input").notNull().default({}),
    /** 任务最终输出（来自最后一次成功的 run） */
    output: jsonb("output"),
    createdBy: uuid("created_by").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
    finishedAt: timestamp("finished_at", { withTimezone: true }),
  },
  (table) => ({
    workspaceIdx: index("tasks_workspace_idx").on(table.workspaceId),
    statusIdx: index("tasks_status_idx").on(table.status),
    workspaceStatusIdx: index("tasks_workspace_status_idx").on(
      table.workspaceId,
      table.status,
    ),
  }),
);

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
