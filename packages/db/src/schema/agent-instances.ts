import { pgTable, uuid, text, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { workspaces } from "./workspaces";
import { agentTemplates } from "./agent-templates";

/**
 * Agent Instance = 用户雇佣后的员工实例（属于某个 workspace）。
 * 与模板分离，拥有独立的 memory、config 与权限授权。
 */
export const agentInstances = pgTable(
  "agent_instances",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    templateId: uuid("template_id")
      .notNull()
      .references(() => agentTemplates.id, { onDelete: "restrict" }),
    name: text("name").notNull(),
    /** 用户级覆盖配置：tone / language / 偏好等 */
    config: jsonb("config").notNull().default({}),
    /** 员工长期记忆：业务上下文 */
    memory: jsonb("memory").notNull().default({}),
    /** 该实例已授予的权限/凭证引用（不存明文密钥） */
    grants: jsonb("grants").notNull().default([]),
    status: text("status").notNull().default("active"), // active / paused / disabled
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    workspaceIdx: index("agent_instances_workspace_idx").on(table.workspaceId),
    templateIdx: index("agent_instances_template_idx").on(table.templateId),
  }),
);

export type AgentInstance = typeof agentInstances.$inferSelect;
export type NewAgentInstance = typeof agentInstances.$inferInsert;
