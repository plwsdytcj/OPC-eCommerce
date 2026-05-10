# OPC 平台 — 6 周 MVP 执行计划

> 与 `EXECUTION.md` 配套：EXECUTION 是战略文档，本文件是 day-by-day 落地。  
> 一切以"黄金路径优先"为准：先打通 `创建任务 → ArkClaw 执行 → 回写交付物` 这一条线，再扩展。

---

## 0. 技术栈定版（已拍板）

| 层 | 选型 | 理由 |
|---|---|---|
| 后端语言 | TypeScript (Node 20+) | 与 Paperclip 同栈，monorepo 友好 |
| Monorepo 工具 | pnpm + Turborepo | Paperclip 同款 |
| Web 框架 | Hono | 轻、跨运行时、Zod 友好 |
| ORM | Drizzle | Paperclip 同款，迁移友好 |
| 数据库 | PostgreSQL | 强事务、JSONB |
| 缓存/队列 | Redis + BullMQ | Node 生态首选 |
| 文件存储 | MinIO（开发）/ TOS（生产） | S3 兼容 |
| 认证 | MVP 用 JWT 中间件，Phase 2 接 Logto | 省 2 天 |
| Workflow 引擎 | 自研最小 DAG 状态机 + worker 轮询 | 不引 Temporal/n8n |
| 验证 | Zod | 与 Drizzle/Hono 互通 |
| 测试 | Vitest | 快、ESM 友好 |

---

## 1. 黄金路径（MVP 必跑通）

```
用户在 Workbench 创建任务
        ↓
task-service 写库
        ↓
workflow-service 拆解（如果是 Workflow）
        ↓
arkclaw-bridge-service 派发到 ArkClaw
        ↓
ArkClaw 员工执行 Skill
        ↓
回调 bridge / 写 task_runs
        ↓
asset-service 入库交付物
        ↓
用户在 Workbench 确认
        ↓
audit-log 全程记录
```

任何不在这条路径上的功能（园区端高级看板、第三方 marketplace、自动发邮件）都**后置**。

---

## 2. Week 1：地基（Day-by-Day）

**目标**：能用 `curl` 创建一个任务 → ArkClaw 跑出结果 → 数据库能查到完整记录

### Day 1 — Monorepo + 基础设施
- [ ] 初始化 `pnpm` workspace + Turborepo
- [ ] 建 `apps/` `services/` `packages/` 三层目录
- [ ] `tsconfig.base.json` + 严格模式
- [ ] `docker-compose.yml`：Postgres 16 + Redis 7 + MinIO
- [ ] `.env.example` 模板
- [ ] git init + 第一次提交

**验收**：`docker compose up` 能拉起三件基础设施，`pnpm install` 不报错

### Day 2 — packages/db（数据模型）
- [ ] Drizzle 初始化
- [ ] 4 张核心表 schema：
  - `agent_templates`
  - `agent_instances`
  - `tasks`
  - `task_runs`
- [ ] 1 张审计表：`audit_logs`
- [ ] 1 张多租户表：`workspaces`
- [ ] 生成 migration + apply
- [ ] 写 1 个 seed 脚本（插入「Listing 专员」模板 + 1 个测试 workspace）

**验收**：`pnpm db:migrate && pnpm db:seed` 能跑，psql 能看到种子数据

### Day 3 — ArkClaw Hello World
- [ ] 注册 ArkClaw 实例 / 拿到 API key
- [ ] 写一个独立脚本 `scripts/arkclaw-hello.ts`，调一次 ArkClaw 跑通
- [ ] 把鉴权、调用方式、回调机制摸清楚，写到 `docs/arkclaw-integration.md`

**验收**：脚本能调通 ArkClaw，拿到一份结构化输出

### Day 4 — arkclaw-bridge-service（接口契约）
- [ ] `services/arkclaw-bridge-service` 起 Hono + Drizzle
- [ ] 实现 3 个接口（详见第 4 节契约）：
  - `POST /v1/runs`
  - `POST /v1/callbacks/arkclaw`
  - `GET /v1/runs/:id`
- [ ] 任务状态机：`pending → running → succeeded / failed / cancelled`
- [ ] 全链路 audit_log 落库

**验收**：`curl -X POST /v1/runs` 能创建一条 run，状态会从 pending 流转到 succeeded

### Day 5 — 端到端串通 + 简单 worker
- [ ] 写一个 `worker/arkclaw-dispatcher`：从 `task_runs` 表拉 pending 记录，调 ArkClaw，回写结果
- [ ] 整理 README 的 quickstart
- [ ] 录一个 30 秒终端 demo（curl → psql 看结果）

**验收**：黄金路径跑通

---

## 3. Week 2-6 节奏（粗排）

### Week 2 — 第 1 个 AI 员工 + Marketplace MVP
- 选「Listing 专员」作为第一个员工（输入输出最清晰）
- `marketplace-service`：模板列表、详情、安装、实例化
- 实例化后能在 Workspace 看到员工

### Week 3 — Workflow + 第 2-3 个员工
- `workflow-service` 最简引擎（DAG + 状态）
- 加「选品经理」+「财务分析师」
- 跑通「7 天冷启动」前 3 步

### Week 4 — 补员工 + 工作台 UI
- 加「供应商开发」+「内容运营」
- Paperclip fork 中文化 + 业务语义改造
- 任务看板 + 交付物中心

### Week 5 — 园区端 + 联调
- 园区运营管理台 MVP（总览、入驻列表、项目进度）
- 端到端联调

### Week 6 — 打磨 + Demo
- Bug fix + 多租户审计
- Demo 视频 + 给园区 PoC 演示

---

## 4. arkclaw-bridge-service 接口契约（Day 4 落地）

### 4.1 POST /v1/runs — 创建执行

请求：
```json
{
  "workspace_id": "uuid",
  "agent_instance_id": "uuid",
  "input": {
    "kind": "listing_optimization",
    "payload": { "product_name": "...", "target_market": "US" }
  },
  "callback_url": "https://internal.../callbacks/task/<task_id>"
}
```

响应：
```json
{
  "run_id": "uuid",
  "status": "pending",
  "created_at": "2026-05-10T10:00:00Z"
}
```

### 4.2 POST /v1/callbacks/arkclaw — ArkClaw 回调

请求（由 ArkClaw 侧调用）：
```json
{
  "run_id": "uuid",
  "status": "succeeded",
  "output": { "title": "...", "bullets": ["..."] },
  "logs": [{ "ts": "...", "level": "info", "msg": "..." }],
  "tokens_used": 1234,
  "finished_at": "2026-05-10T10:01:30Z"
}
```

响应：`200 OK`

### 4.3 GET /v1/runs/:id — 查询状态

响应：
```json
{
  "run_id": "uuid",
  "status": "succeeded",
  "task_id": "uuid",
  "agent_id": "uuid",
  "logs": [...],
  "output": {...},
  "started_at": "...",
  "finished_at": "..."
}
```

### 4.4 状态机

```
pending → running → succeeded
                  ↘ failed
                  ↘ cancelled (超时 / 用户取消)
```

任何状态变更必须写 `audit_logs`。

---

## 5. 必须严守的工程原则（不要妥协）

1. **每个表强制 `workspace_id` 索引**：多租户隔离从 Day 2 就贯彻
2. **所有写入必须落 audit_log**：先做容易，后补难
3. **Skill 调用必须可重入**：`run_id` 幂等
4. **不在 MVP 引入 RPA / 自动发邮件 / 自动下单**：等 Phase 3
5. **Marketplace 不开放第三方上架**：MVP 只有官方员工
6. **Paperclip fork 不要乱改**：先跑起来，再做 patch，patch 可追踪

---

## 6. 风险开关（出现就停下）

- 🚨 ArkClaw 不能稳定回调 → 切换为长轮询模式（worker 主动拉）
- 🚨 Paperclip 改造超 5 天 → 砍掉 fork 路径，自研最小 UI
- 🚨 第一个员工产出质量低 → 暂停加员工，先打磨 Listing 专员

---

## 7. 今天就做（Day 1 启动）

- [ ] monorepo 骨架已搭（见仓库根目录）
- [ ] `pnpm install` 跑通
- [ ] `docker compose up -d` 拉起 Postgres / Redis / MinIO
- [ ] 读 README 的 quickstart 验证环境
- [ ] 完成 Day 2 的数据模型设计

---

> **节奏感**：Week 1 不写 UI、不做 marketplace、不碰园区端。  
> 一周只为一件事 —— 黄金路径跑通。
