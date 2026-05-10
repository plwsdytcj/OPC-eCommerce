import { pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";

/**
 * Workspace = OPC 一人公司 / 店铺 / 项目空间。
 * 多租户隔离的最小单位：所有业务数据都必须 scoped 到 workspace。
 */
export const workspaces = pgTable(
  "workspaces",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    parkId: uuid("park_id"),
    ownerId: uuid("owner_id").notNull(),
    name: text("name").notNull(),
    businessType: text("business_type"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    ownerIdx: index("workspaces_owner_idx").on(table.ownerId),
    parkIdx: index("workspaces_park_idx").on(table.parkId),
  }),
);

export type Workspace = typeof workspaces.$inferSelect;
export type NewWorkspace = typeof workspaces.$inferInsert;
