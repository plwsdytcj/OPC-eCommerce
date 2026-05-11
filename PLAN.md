# OPC 平台 — MVP 执行计划

> 与 `EXECUTION.md` 配套：EXECUTION 是战略文档，本文件是 day-by-day 落地。

---

## 0. V0.3 状态快照 (2026-05-11, Sprint 1 收官)

**Sprint 1 当周完成（核心闭环已通）**：

- ✅ paperclip MIT 仓库以 git submodule 形式挂载到 `apps/workbench`，锁定 commit `0096b56a`
- ✅ paperclip 在 worktree 模式下本机正常启动：`http://127.0.0.1:3101`，内嵌 PG 端口 54330
- ✅ pnpm workspace 配置：root 包不污染 paperclip / OPC plugin，三方独立 install
- ✅ **`@opc/plugin-cross-border-skills`**（5 个 SKILL.md，MIT，esbuild text-loader 内嵌进 manifest，每家 company 自动 reconcile）
- ✅ **`@opc/plugin-cross-border-agents`**（8 个 AI 员工 managedAgents，每家 company 自动入驻 listing-pro / niche-finder / keyword / cfo / expansion / fba / compliance / adcopy；声明 adapterType: claude_local）
- ✅ **`@opc/plugin-cross-border-tools`**（4 个 mock 工具：amazon_search_competitors / amazon_get_keyword_volumes / logistics_estimate_freight / compliance_lookup，已 paperclip-tool-registry 注册）
- ✅ **A4 链路打通**：marketplace `<a href="/launch/<agentKey>?intent=...">` → Next.js Route Handler 拿 plugin UUID + company UUID → 命中 paperclip plugin /api/launch → 自动创建 agent session + 发首条消息 → 302 跳工作台 agent 详情页（`/OPC/agents/<agentId>?session=...&via=marketplace`）。浏览器实测通过：sidebar 显示 "1 live"，agent 页加载正常。
- ✅ marketplace 主页 + /store 双页面跑在 `http://localhost:3200`
- ✅ 8 个 agent 全部切换到 claude_local，本机 Claude CLI 已能被 paperclip 拉起

**Sprint 1 LLM 链路最终结论 (2026-05-11 10:40)**：

- ✅ **claude_local 卡死真因 = 你接的 Anthropic 兼容网关 `api.happycoding.online` 在挂**（直接 curl 也 502，跟 paperclip / Claude CLI 都无关）
- ✅ **8 个 agent 全部切到 `codex_local`** (PATCH /api/agents/:id `{adapterType:"codex_local"}`)，走本地 codex CLI + GPT-5.5
- ✅ **listing-pro 端到端通**：
  - 直接 curl wakeup `source=on_demand`：90s 跑完，产出 4 段 agent_message，包括「上架输入卡」表格 + 4 步执行方案，明确标 `[需核实]` 字段
  - 浏览器点 marketplace "Run now"：30s 跑完，sidebar 实时 `1 live` → `succeeded`，"30秒摘要 + 下一步可执行动作 + 详细执行方案" 全是 paperclip SOP 词汇
- 🟡 **小遗憾**：codex 在工作区文件系统找不到 `amazon-listing-optimization` SKILL.md（plugin 装的 skill 只活在 paperclip 数据库里，没落盘）。agent 优雅降级用等效 SOP 输出。Sprint 2 加 1 个小修：让 plugin-cross-border-skills 同时把 SKILL.md 写到 `~/.paperclip-worktrees/.../codex-home/skills/`。

**取消 / 替代（V0.1 的过时计划）**：

- ❌ 自研 marketplace-service / workflow-service / permission-service / audit-log-service（paperclip 已内置）
- 🟡 services/arkclaw-bridge-service 待裁决（重写成 plugin 还是直接删，见 §3.5）
- 🟡 自研 Hono / Drizzle schema / Vitest 测试链路 — 改为复用 paperclip 同款工具栈

---

## 0.1 V0.3 → V0.4：Sprint 2 待办（按优先级）

| 步 | 事项 | 形态 | 难度 | 备注 |
|---|---|---|---|---|
| **G1** | plugin-cross-border-skills 把 5 个 SKILL.md 也写到 codex-home 文件系统，让 codex agent 真能 `cat` 到 | plugin worker 改一行 | 0.5d | 让 listing-pro 真按 SKILL.md 工作而不是 fallback |
| **G2** | 给 listing-pro 加一个完整 "假设你已有所有信息" 的 demo prompt，浏览器跑一次出完整 title+bullets+A+ | seed prompt | 0.5d | 出"成品 listing"作为 marketplace showcase |
| **E1** | 用真 Listing 截图替换 marketplace `/store` 占位 showcase 图 | 静态资源 | 0.5d | 依赖 G2 |
| **F1** | marketplace 部署到 Cloudflare Pages | wrangler + DNS | 0.5d | 域名待定 |
| **F2** | 评估 paperclip 部署形态：cloud mode + 外接 RDS Postgres | 调研 + POC | 1.5d | paperclip 主要面向本机内测 |
| **E3** | UI 风格 A/B：编辑暖纸 vs Mulerun 暗赛博，二选一定稿 | tailwind palette 切换 | 0.5d | 用户反馈过倾向 Mulerun 风 |
| **D**  | `@opc/plugin-cross-border-routines`（7 天冷启动 routine） | TS 插件 | 1d | Sprint 2 后期 |
| **H1** | 排查 / 切换 LLM 网关：要么修 happycoding，要么把 claude_local fallback 到本机直连 + 单独网关 | ops | 0.5d | 不阻塞 demo，但 ChatGPT 路径要冗余 |

> 当前 demo 路径：开 `pnpm dev` 后浏览器分别打开 `:3200/`（marketplace）和 `:3101/OPC`（工作台），任意 Run now 卡片点开都会真的在工作台落到 agent 详情页 + sidebar live counter 加 1。

---

## 0.3 LLM 链路诊断 / 切换 cheatsheet

把 listing-pro 真跑出一份 Listing，按下面顺序定位：

```bash
# 1. 留 1 个 agent，用 process adapter 跑空命令验证 paperclip 拉子进程没问题
curl -s -X PATCH http://127.0.0.1:3101/api/agents/<id> \
  -H 'Content-Type: application/json' \
  -d '{"adapterType":"process","adapterConfig":{"command":"/bin/echo","args":["hello from paperclip"]}}'
curl -X POST http://127.0.0.1:3101/api/agents/<id>/wakeup -d '{}' -H 'Content-Type: application/json'
# 看 /api/heartbeat-runs/<runId>/log 是不是有 "hello from paperclip"

# 2. 换 claude_local，但跳过 add-dir，看 Claude 收没收到 prompt
#    需在 paperclip 源码 packages/adapters/claude-local/src/server/execute.ts:655 注释掉
#    args.push("--add-dir", effectivePromptBundleAddDir);
# 然后再跑

# 3. 如果还不行，直接手动模拟 paperclip 调用 Claude：
echo "你是 Listing 优化员。任务：3 句话推荐一款宠物饮水机的 listing title。" | \
  claude --print - --output-format stream-json --verbose --dangerously-skip-permissions

# 4. 如果手动也卡，说明 Claude CLI 在该 cwd 下有问题；换 codex_local：
curl -s -X PATCH http://127.0.0.1:3101/api/agents/<id> \
  -H 'Content-Type: application/json' -d '{"adapterType":"codex_local"}'
```

期待：1 跑得通；2 跑得通且能收到 Claude assistant turn；3 应该 5-30 秒内出结果。如果 1 通 2 不通，问题在 paperclip 的 cwd/add-dir 配置；2 通但浏览器 [Run Now] 不通，问题在 wakePrompt 模板渲染。

**当前生产姿势（已验证可用，2026-05-11）：**

```bash
# 一键把所有跨境 agent 切到 codex_local
COMPANY_ID=$(curl -s http://127.0.0.1:3101/api/companies | jq -r '.[0].id')
curl -s "http://127.0.0.1:3101/api/companies/$COMPANY_ID/agents" \
  | jq -r '.[] | select(.icon != null) | .id' \
  | while read AGENT_ID; do
      curl -s -X PATCH "http://127.0.0.1:3101/api/agents/$AGENT_ID" \
        -H 'Content-Type: application/json' \
        -d '{"adapterType":"codex_local"}' > /dev/null
    done
echo "8 agents switched to codex_local"
```

**端到端冒烟测试：**

```bash
LISTING_ID=$(curl -s "http://127.0.0.1:3101/api/companies/$COMPANY_ID/agents" \
  | jq -r '.[] | select(.name | contains("Listing")) | .id')
RUN_ID=$(curl -s -X POST "http://127.0.0.1:3101/api/agents/$LISTING_ID/wakeup" \
  -H 'Content-Type: application/json' \
  -d '{"source":"on_demand","payload":{"prompt":"任务：给一款 65W GaN 充电器写美亚 listing title。"}}' \
  | jq -r '.id')
# 等 30-90s 看 succeeded
watch -n 5 "curl -s http://127.0.0.1:3101/api/heartbeat-runs/$RUN_ID | jq '.status'"
```

---

## 0.2 V0.1 历史技术栈（保留作为参考）

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

## 3.5 services/arkclaw-bridge-service 去留裁决（V0.2 新增）

**结论：暂不删，但停跑、冻结，后续重写成 plugin。**

理由：
- V0.1 bridge 的核心价值是「跨进程的 agent run 派发 + 回调 + run-poller 兜底」，逻辑本身是有用的（约 600 行 TS，含审计、超时兜底、mock dispatch）。
- 但当前 paperclip plugin worker 已经能跑 agent，在 Phase 1 我们不再依赖外部 ArkClaw 运行时，bridge 暂时无用武之地。
- 直接删 = 丢失 IP；保留独立服务 = 误导后人觉得它是必要的。

执行：

1. 给 `services/arkclaw-bridge-service/README.md` 顶部加冻结标记，说明 V0.2 的归档原因 + 何时复活。
2. 在 root `package.json` 的 turbo dev 任务中**不要包含**这个服务。
3. Phase 2 启动时，决定：
   - **A)** 复活：把 `arkclaw-bridge-service/src/arkclaw/dispatch.ts` + `workers/run-poller.ts` 改写成 `packages/plugin-arkclaw-bridge/`（plugin manifest + tools 声明）
   - **B)** 删除：如果 paperclip 自带的 agent runtime + sandbox SDK 完全满足跨境业务负载，归档目录后删除。

---

## 4. arkclaw-bridge-service 接口契约（V0.1 历史 - 仅参考）

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
