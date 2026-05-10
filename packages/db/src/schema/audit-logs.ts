import { pgTable, uuid, text, timestamp, jsonb, index } from "drizzle-orm/pg-core";

/**
 * Audit Log = 不可变操作审计。
 * 每个写入动作（创建/更新 task、调用 ArkClaw、回调结果、用户确认等）必须落一条。
 * 设计原则：append-only。
 */
export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id"),
    actorType: text("actor_type").notNull(), // user / agent / system / arkclaw
    actorId: text("actor_id"),
    action: text("action").notNull(), // task.create / run.dispatch / run.callback / agent.install ...
    targetType: text("target_type"),
    targetId: text("target_id"),
    payload: jsonb("payload").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    workspaceIdx: index("audit_logs_workspace_idx").on(table.workspaceId),
    actionIdx: index("audit_logs_action_idx").on(table.action),
    targetIdx: index("audit_logs_target_idx").on(table.targetType, table.targetId),
  }),
);

export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;
