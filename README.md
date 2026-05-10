# OPC — 跨境一人公司 AI 员工平台

> Cross-border OPC AI Workforce & Incubation Platform — MVP

面向跨境 OPC 园区的「AI 员工市场 + 一人公司工作台 + 园区管理台 + ArkClaw 员工运行时」。

📄 战略：[`opc_v3.md`](./opc_v3.md) · 落地：[`EXECUTION.md`](./EXECUTION.md) · 排期：[`PLAN.md`](./PLAN.md)

---

## 1. 仓库结构

```
opc/
├── apps/                              # 用户端 / 园区端 / 平台后台（Phase 1 起逐步加）
├── services/
│   └── arkclaw-bridge-service/        # ✅ Hono 桥接 ArkClaw（任务派发 + 回调 + 审计）
├── packages/
│   └── db/                            # ✅ Drizzle schema + migrations + seed
├── workers/                           # Phase 2 加：playwright / dispatcher
├── docker/
│   └── docker-compose.yml             # ✅ 本地 Postgres / Redis / MinIO
├── _eval/                             # 选型评估（不入仓）
├── opc_v3.md                          # PRD
├── EXECUTION.md                       # 战略执行文档
└── PLAN.md                            # 6 周 day-by-day 计划
```

---

## 2. 快速开始

### 2.1 前置依赖

- Node.js **20+**
- pnpm **9.15+**
- Docker（用于 Postgres / Redis / MinIO）

### 2.2 拉起本地基础设施

```bash
cp .env.example .env
pnpm install

# 启动 Postgres / Redis / MinIO
pnpm infra:up

# 数据库迁移 + 种子
pnpm db:generate   # 第一次需要先生成 SQL
pnpm db:migrate
pnpm db:seed
```

> MinIO 控制台：<http://localhost:9001>（账号 `opc` / 密码 `opcopcopc`）

### 2.3 启动 ArkClaw Bridge

```bash
pnpm --filter @opc/arkclaw-bridge-service dev
# → http://localhost:4001/health
```

### 2.4 验证黄金路径（mock 模式）

未配置 `ARKCLAW_API_KEY` 时，bridge 会用 mock 派发器，1.5s 后回调一个假成功。

```bash
# 1) 拿到种子 workspace_id
WS=$(psql "$DATABASE_URL" -tAc "select id from workspaces limit 1")

# 2) 创建一个 task
TASK=$(psql "$DATABASE_URL" -tAc "insert into tasks (workspace_id, title, type, created_by)
  values ('$WS', 'Listing 优化', 'listing', '00000000-0000-0000-0000-000000000001')
  returning id")

# 3) 触发执行
RUN=$(curl -s -X POST http://localhost:4001/v1/runs \
  -H "content-type: application/json" \
  -d "{\"workspace_id\":\"$WS\",\"task_id\":\"$TASK\",\"input\":{\"product\":\"pet water fountain\"}}" \
  | jq -r .run_id)

# 4) 1-2 秒后查状态
sleep 2
curl -s http://localhost:4001/v1/runs/$RUN | jq
```

预期：`status: "succeeded"`，`output.mock: true`，`audit_logs` 表里有 `run.create` / `run.dispatch` / `run.callback` 三条。

---

## 3. 接口契约（Bridge）

| 方法 | 路径 | 用途 |
|---|---|---|
| `GET` | `/health` | 健康检查 |
| `POST` | `/v1/runs` | 创建一次执行（自动派发 ArkClaw） |
| `GET` | `/v1/runs/:id` | 查询执行状态 |
| `POST` | `/v1/callbacks/arkclaw` | ArkClaw 侧回调结果 |

详见 [`PLAN.md` 第 4 节](./PLAN.md)。

---

## 4. 常用命令

```bash
pnpm dev                    # 全量 dev (turbo)
pnpm build                  # 全量 build
pnpm typecheck              # 类型检查
pnpm test                   # 运行测试
pnpm db:generate            # 生成 Drizzle 迁移
pnpm db:migrate             # 应用迁移
pnpm db:seed                # 写入种子数据
pnpm db:studio              # 打开 Drizzle Studio
pnpm infra:up               # 拉起本地基础设施
pnpm infra:down             # 停止
pnpm infra:logs             # 查看日志
```

---

## 5. 架构原则（不要妥协）

- **多租户硬隔离**：每张业务表必须有 `workspace_id` 索引，所有查询强制带租户条件
- **Append-only 审计**：写入动作 → `audit_logs`，先做容易，后补难
- **模板与实例分离**：`agent_templates`（无租户）→ `agent_instances`（属于 workspace）
- **MVP 不开放第三方上架**：只有官方员工
- **高风险操作必须人工确认**：跨境业务合规要求

---

## 6. 路线图

- ✅ Week 1：地基（monorepo + db + bridge skeleton + 黄金路径 mock）
- ⏳ Week 2：第一个 AI 员工（Listing 专员）+ marketplace MVP
- ⏳ Week 3：Workflow 引擎 + 选品/财务员工
- ⏳ Week 4：补员工 + 工作台 UI
- ⏳ Week 5：园区端 + 联调
- ⏳ Week 6：Demo + PoC

---

## 7. 许可

Private. 内部项目。
