# OPC — 跨境一人公司 AI 员工平台

> Cross-border OPC AI Workforce & Incubation Platform — V0.3 (Sprint 1 收官)

面向跨境 OPC 园区的「AI 员工市场 + 一人公司工作台 + 园区管理台」。

📄 战略：[`opc_v3.md`](./opc_v3.md) · 落地：[`EXECUTION.md`](./EXECUTION.md) · 排期：[`PLAN.md`](./PLAN.md)

---

## 1. 当前架构（V0.3）

```
                       用户浏览器
                          │
       ┌──────────────────┴──────────────────┐
       ▼                                     ▼
 marketplace (Next 16)                工作台 paperclip
 http://localhost:3200                http://127.0.0.1:3101
   • /         主页：任务广场
   • /store    Agent Store
   • /launch/[agent]  Route Handler
        │  302 跳到 paperclip
        ▼
 ─────────────────────────────────────────────────────────────
  paperclip   |   /api/plugins/<uuid>/api/launch
              ▼      ↓ create session + sendMessage
     ┌─────────────┴───────────┐
     ▼                         ▼
 plugin-cross-border-agents   plugin-cross-border-skills   plugin-cross-border-tools
 • 8 个 managedAgents          • 5 个 SKILL.md              • 4 个 mock tools
 • adapterType: claude_local   • 自动 reconcile catalog     • amazon / logistics / compliance
 • /api/launch route                                          • paperclip-tool-registry
```

- **marketplace**（`apps/marketplace`）：Mulerun 风格静态站，对应 "Run now / Hire" 按钮全部走 `/launch/[agent]` 调 paperclip plugin API → 用户落到 paperclip agent 详情页。
- **工作台**（`apps/workbench`，paperclip git submodule）：AI 公司操作系统——Company / Agent / Skill / Issue / Goal 一应俱全。我们 3 个 OPC 插件全部以 dropin manifest+worker 形式挂入。

---

## 2. 仓库结构

```
opc/
├── apps/
│   ├── workbench/                          # 🧩 paperclip git submodule (端口 3101)
│   └── marketplace/                        # ✅ Next 16 marketplace 站 (端口 3200)
├── packages/
│   ├── plugin-cross-border-skills/         # ✅ 5 个跨境 SKILL.md
│   ├── plugin-cross-border-agents/         # ✅ 8 个跨境 AI 员工 + /launch API
│   ├── plugin-cross-border-tools/          # ✅ 4 个 mock 跨境工具
│   ├── db/                                 # 📦 V0.1 Drizzle schema (历史保留)
│   └── plugin-*/                           # 🚧 后续插件落地于此
├── services/
│   └── arkclaw-bridge-service/             # 🧊 FROZEN (V0.1 参考实现)
├── docker/                                 # V0.1 Postgres/Redis/MinIO compose
├── _eval/                                  # 评估期产物（agentsystems / openmule / skills-sources）
├── opc_v3.md / EXECUTION.md / PLAN.md      # 战略+落地+排期文档
└── pnpm-workspace.yaml                     # 排除 apps/workbench/** 与 packages/plugin-*/**
```

**workspace 拓扑**：3 个独立 pnpm 安装范围
1. **OPC root**（`apps/* services/* packages/* workers/*`，但**排除** workbench 与 plugin-*）— 用 root 的 `pnpm install`
2. **paperclip**（`apps/workbench/`）— `cd apps/workbench && pnpm install`
3. **每个 OPC 插件**（`packages/plugin-*/`）— `cd packages/plugin-* && pnpm install --ignore-workspace`

---

## 3. 快速开始

### 3.1 前置依赖

- Node.js **22.x**（paperclip 当前 LTS 兼容线，⚠️ Node 24 会触发 `Abort trap: 6`）
- pnpm **9.15+**（用 `corepack prepare pnpm@9.15.4 --activate` 锁定）

### 3.2 拉子模块 + 装依赖

```bash
git clone <opc-repo> && cd opc
git submodule update --init --recursive

# 1. OPC root
pnpm install

# 2. paperclip (apps/workbench)
cd apps/workbench
cp .env.example .env  # 如还没有
pnpm install

# 3. 三个 OPC 插件 (Sprint 1)
for p in plugin-cross-border-skills plugin-cross-border-agents plugin-cross-border-tools; do
  cd ../../packages/$p
  pnpm install --ignore-workspace
  pnpm build
done
```

### 3.3 启动 paperclip 工作台

```bash
cd apps/workbench

# 第一次启动需要先初始化 worktree（创建 .paperclip/.env）
pnpm paperclipai worktree init

pnpm dev
# → API:  http://127.0.0.1:3101/api  (health: /api/health)
# → UI:   http://127.0.0.1:3101
# → DB:   ~/.paperclip-worktrees/instances/master/db (embedded pg :54330)
```

### 3.4 安装 3 个 OPC 插件

```bash
ROOT=$(pwd)  # 在 OPC 根目录

for slug in plugin-cross-border-skills plugin-cross-border-agents plugin-cross-border-tools; do
  curl -X POST http://127.0.0.1:3101/api/plugins/install \
    -H 'Content-Type: application/json' \
    -d "{\"packageName\":\"$ROOT/packages/$slug\",\"isLocalPath\":true}" | jq '.status'
done

curl -s http://127.0.0.1:3101/api/plugins | jq '.[] | {pluginKey, status}'
```

### 3.5 启动 marketplace

```bash
cd apps/marketplace
pnpm install --ignore-workspace
pnpm dev
# → http://localhost:3200
```

### 3.6 把 8 个 agent 切到 codex_local（**必做**）

> Claude CLI 走的 Anthropic 兼容网关（`ANTHROPIC_BASE_URL`）当前 502，所以默认 `claude_local` 跑不通。
> 用本机 `codex` CLI + GPT-5.5 替代，已在 2026-05-11 验证可用。

```bash
COMPANY_ID=$(curl -s http://127.0.0.1:3101/api/companies | jq -r '.[0].id')
curl -s "http://127.0.0.1:3101/api/companies/$COMPANY_ID/agents" \
  | jq -r '.[] | select(.icon != null) | .id' \
  | while read AGENT_ID; do
      curl -s -X PATCH "http://127.0.0.1:3101/api/agents/$AGENT_ID" \
        -H 'Content-Type: application/json' \
        -d '{"adapterType":"codex_local"}' > /dev/null
    done
```

### 3.7 验证端到端

```bash
# 1. 确认 plugin 装满：5 skills + 8 agents + 4 tools
curl -s "http://127.0.0.1:3101/api/companies/$COMPANY_ID/skills" \
  | jq '[.[] | select(.sourceType == "plugin")] | length'   # → 5
curl -s "http://127.0.0.1:3101/api/companies/$COMPANY_ID/agents" \
  | jq '[.[] | select(.icon != null)] | length'              # → 8

# 2. 浏览器实测：http://localhost:3200/ 点任意 "Run now"
#    → 302 跳 http://127.0.0.1:3101/OPC/agents/<agentId>?session=...&via=marketplace
#    → agent 详情页 "Live Run" 30-90s 内出 "succeeded"
#    → 输出形如：「30秒摘要…下一步可执行动作…详细执行方案」（paperclip SOP）

# 3. 命令行冒烟：listing-pro 给个 prompt 直接跑
LISTING_ID=$(curl -s "http://127.0.0.1:3101/api/companies/$COMPANY_ID/agents" \
  | jq -r '.[] | select(.name | contains("Listing")) | .id')
RUN_ID=$(curl -s -X POST "http://127.0.0.1:3101/api/agents/$LISTING_ID/wakeup" \
  -H 'Content-Type: application/json' \
  -d '{"source":"on_demand","payload":{"prompt":"任务：给一款 65W GaN 充电器写美亚 listing title。"}}' \
  | jq -r '.id')
sleep 60
curl -s "http://127.0.0.1:3101/api/heartbeat-runs/$RUN_ID/log" | jq -r '.content' \
  | python3 -c "import sys,json;[print(t) for line in sys.stdin if (d:=json.loads(line.strip())) for s in d.get('chunk','').split(chr(10)) if (i:=json.loads(s)).get('item',{}).get('type')=='agent_message' for t in [i['item']['text']]]" 2>/dev/null
```

---

## 4. 写新插件（5 分钟入门）

```bash
# 在 paperclip 里 build 出脚手架工具（已 build 可跳过）
cd apps/workbench
pnpm --filter @paperclipai/plugin-sdk build
pnpm --filter @paperclipai/create-paperclip-plugin build

# 在 OPC packages 下生成新插件
node packages/plugins/create-paperclip-plugin/dist/index.js \
  @opc/plugin-XXX \
  --output /absolute/path/to/opc/packages \
  --sdk-path /absolute/path/to/opc/apps/workbench/packages/plugins/sdk

# 进新插件目录装依赖（必须 --ignore-workspace）
cd ../../packages/plugin-XXX
pnpm install --ignore-workspace
pnpm build

# 安装到 paperclip
PLUGIN_PATH=$(pwd)
curl -X POST http://127.0.0.1:3101/api/plugins/install \
  -H 'Content-Type: application/json' \
  -d "{\"packageName\":\"$PLUGIN_PATH\",\"isLocalPath\":true}"
```

paperclip 自带 plugin-dev-watcher，写代码后 `pnpm build` 会自动热重载。

---

## 5. 已知约束 / 踩坑记

- ⚠️ **Node 24 不兼容**：`pnpm install` 会 `Abort trap: 6`。用 nvm 切到 v22.22.1。
- ⚠️ **不要在 root 跑 `pnpm install` 进 workbench**：会污染 paperclip 的 ~10 个子包版本。`pnpm-workspace.yaml` 已排除。
- ⚠️ **插件必须 `--ignore-workspace` 安装**：否则 `.paperclip-sdk/*.tgz` 路径解析失败。
- ⚠️ **`OPC root .env` 的 `DATABASE_URL` 会污染 paperclip 启动**：要么 `unset DATABASE_URL` 后再起 paperclip，要么把它放到 `apps/workbench/.env` 的 paperclip 单独 DB URL。

---

## 6. V0.1 历史资产（保留参考）

- `services/arkclaw-bridge-service/` — 600 行 ArkClaw 桥接逻辑（dispatch + run-poller + audit），冻结状态，详见该目录的 README。
- `packages/db/` — V0.1 Drizzle schema (workspaces / agent_templates / tasks / task_runs / audit_logs)，目前 paperclip 自己的 schema 已经覆盖大部分场景，这里可作为日后回头补充自定义业务表的起点。
- `docker/docker-compose.yml` — Postgres/Redis/MinIO 的 dev 容器编排，paperclip 内嵌 PG 模式下不需要，但生产部署时可能复用。

---

## 7. 路线图

- ✅ V0.2：paperclip submodule + 第一个跨境 SKILL.md 插件 + 端到端验证
- ⏳ A：dashboard widget UI（5 个 skill 状态 + 一键 reconcile）
- ⏳ B：`plugin-cross-border-agents`（用 managedAgents 注册选品员/Listing 员/合规员，绑 5 个 skill）
- ⏳ C：`plugin-cross-border-tools`（亚马逊/Shopify/物流 mock tools）
- ⏳ D：「7 天冷启动」managedRoutine 跑通业务剧本
- ⏳ E：园区视角看板（cross-company）插件
- ⏳ F：评估 ArkClaw 桥接是否复活

---

## 8. 许可

Private. 内部项目。

第三方 SKILL.md 来源（全部 MIT）：
- [`nexscope-ai/Amazon-Skills`](https://github.com/nexscope-ai/Amazon-Skills) — listing / niche-finder / keyword-research
- [`nexscope-ai/eCommerce-Skills`](https://github.com/nexscope-ai/eCommerce-Skills)
- [`jeffreydebolt/ecom-cfo-skill`](https://github.com/jeffreydebolt/ecom-cfo-skill) — ecom-cfo

平台底座：
- [`paperclipai/paperclip`](https://github.com/paperclipai/paperclip) (MIT) — 集成于 `apps/workbench/`
