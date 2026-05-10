import { pgTable, uuid, text, timestamp, jsonb, index } from "drizzle-orm/pg-core";

/**
 * Agent Template = Marketplace 中的员工模板（不属于任何 workspace）。
 * 用户雇佣后会克隆为 agent_instances（属于某个 workspace）。
 */
export const agentTemplates = pgTable(
  "agent_templates",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    category: text("category").notNull(), // listing / supplier / content / finance / sourcing ...
    sourceType: text("source_type").notNull().default("official"), // official / park / vendor / third_party
    status: text("status").notNull().default("active"), // active / draft / archived
    description: text("description"),
    soulPrompt: text("soul_prompt").notNull(),
    /** 员工能力声明：[{ id, name, description }] */
    skills: jsonb("skills").notNull().default([]),
    /** 工具/外部 API 声明：[{ kind, config }] */
    tools: jsonb("tools").notNull().default([]),
    /** 权限声明：read/write/exec scopes */
    permissions: jsonb("permissions").notNull().default({}),
    /** 输出 schema：用于校验 task_runs.output */
    outputSchema: jsonb("output_schema").notNull().default({}),
    version: text("version").notNull().default("0.1.0"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    categoryIdx: index("agent_templates_category_idx").on(table.category),
    statusIdx: index("agent_templates_status_idx").on(table.status),
  }),
);

export type AgentTemplate = typeof agentTemplates.$inferSelect;
export type NewAgentTemplate = typeof agentTemplates.$inferInsert;
