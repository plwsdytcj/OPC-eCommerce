# 跨境 OPC 园区 AI 孵化平台 — 执行文档

版本：V0.1
对应 PRD：`opc_v3.md` (V0.3)
文档目的：把 PRD 落成可执行的开发计划、技术选型与阶段排期

---

## 1. 技术选型最终结论

### 1.1 三件套架构

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│   Paperclip          OpenMule          ArkClaw/OpenClaw    │
│   ─────────          ────────          ─────────────       │
│   工作台底座         员工市场底座       员工运行时          │
│   AI 公司操作系统    雇佣 / 安装        Soul/Skill/Tool     │
│                                                            │
└────────────────────────────────────────────────────────────┘
                             ↑
                  自研胶水服务（必须）
                  Bridge / Workflow / Permission
```

### 1.2 选型对照表

| 层 | 选型 | 替代候选 | 决策理由 |
|---|---|---|---|
| 工作台底座 | `paperclipai/paperclip` | Multica | PRD 核心隐喻是「AI 公司」，Paperclip 内置 org / governance / budget，与产品定位同构 |
| 员工包模板 | `paperclipai/companies` | 自研 | 直接对应「行业员工包」概念 |
| 员工市场 | `James4Ever0/openmule`（待体检） | 自研 | fork 改造比从零写更快，但需要先做适配性评估 |
| 员工运行时 | `ArkClaw` 托管 + `openclaw/openclaw` 参考 | 无 | PRD 已明确 |
| 任务看板 UX | 参考 `multica-ai/multica` | 无 | 不作为底座，仅借鉴交互设计 |
| 自动化执行 | `n8n-io/n8n` | 自研 | Phase 2 引入 |
| RPA / 浏览器自动化 | `microsoft/playwright` | 无 | Phase 2/3 引入 |
| LLM 观测 | `langfuse/langfuse` | 无 | Phase 2 引入 |
| 数据库 | `PostgreSQL` | 无 | 强事务、JSON 字段支持 |
| 文件存储 | `MinIO` 或 `TOS` | S3 | 私有化与公有云兼容 |
| 身份认证 | `Logto` | Keycloak | 多租户友好，运维更轻 |
| 任务队列 | `BullMQ` (Redis) | Celery | Node 生态优先 |

### 1.3 自研模块清单（不可外包）

| 服务 | 职责 | MVP 必做 |
|---|---|---|
| `marketplace-service` | 员工模板/实例化/权限声明 | ✅ |
| `workflow-service` | 业务流程编排（7 天冷启动 / 供应商开发） | ✅ |
| `arkclaw-bridge-service` | 任务派发 / 回调 / 重试 / 状态写回 | ✅ |
| `permission-service` | 多租户隔离 + 最小权限 | ✅ |
| `audit-log-service` | 操作审计日志 | ✅ |
| `asset-service` | 店铺/产品/供应商/交付物资产管理 | ✅ |
| `notification-service` | 用户通知 / 服务商提醒 | Phase 2 |

---

## 2. 系统架构

### 2.1 模块分层

```
┌─────────────────────────────────────────────────────────────┐
│  apps/                                                       │
│    ├── opc-workbench       (OPC 用户端，基于 Paperclip 改造) │
│    ├── park-dashboard      (园区运营管理台)                  │
│    └── platform-admin      (平台后台)                        │
├─────────────────────────────────────────────────────────────┤
│  services/                                                   │
│    ├── workspace-service       业务对象（园区/公司/项目）    │
│    ├── task-service            任务生命周期                  │
│    ├── marketplace-service     员工库（fork OpenMule？）     │
│    ├── workflow-service        Workflow 编排                 │
│    ├── arkclaw-bridge-service  桥接 ArkClaw                  │
│    ├── permission-service      权限                          │
│    ├── audit-log-service       审计                          │
│    ├── asset-service           业务资产                      │
│    └── notification-service    通知                          │
├─────────────────────────────────────────────────────────────┤
│  workers/                                                    │
│    ├── playwright-worker     RPA（Phase 2）                  │
│    └── n8n-instance          自动化（Phase 2）               │
├─────────────────────────────────────────────────────────────┤
│  runtime/                                                    │
│    └── ArkClaw 托管实例      AI 员工运行时                   │
├─────────────────────────────────────────────────────────────┤
│  infra/                                                      │
│    ├── PostgreSQL    主数据                                  │
│    ├── Redis         队列 / 缓存                             │
│    ├── MinIO/TOS     文件 / 交付物                           │
│    └── Logto         身份认证                                │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 黄金路径（MVP 必须打通）

```
用户在 OPC Workbench 创建任务
        ↓
task-service 写入任务记录
        ↓
workflow-service 拆分 / 分配员工
        ↓
arkclaw-bridge-service 调用 ArkClaw
        ↓
ArkClaw 员工执行 Skill / Tool
        ↓
结果回调到 bridge
        ↓
asset-service 入库交付物
        ↓
用户在 Workbench 确认 / 派生新任务
        ↓
audit-log-service 全程记录
```

---

## 3. MVP 范围（Phase 1）

### 3.1 用户侧（必做）

- [ ] OPC 注册 / 登录（Logto）
- [ ] 创建 Workspace（一人公司）
- [ ] 我的 AI 员工（5 个官方员工）
- [ ] 任务看板（创建 / 分配 / 查看 / 确认）
- [ ] 新品项目管理
- [ ] Workflow 启动（2 个）
- [ ] 交付物中心（下载 / 预览）

### 3.2 园区侧（必做）

- [ ] 园区项目总览
- [ ] 入驻 OPC 列表
- [ ] 项目进度看板
- [ ] 卡点统计（基础版）
- [ ] 服务商介入提醒（手动标记即可）

### 3.3 员工库（必做）

- [ ] 5 个官方员工模板：选品经理 / 供应商开发 / Listing / 内容运营 / 财务
- [ ] 员工详情页（含权限声明）
- [ ] 雇佣安装 → 实例化到 Workspace
- [ ] 员工实例独立记忆 / 权限隔离

### 3.4 Workflow（必做）

- [ ] 7 天跨境新品冷启动 Workflow
- [ ] 供应商开发 Workflow

### 3.5 ArkClaw 集成（必做）

- [ ] 至少打通 1 条员工执行链路
- [ ] 任务派发 → 结果回传
- [ ] 执行日志落库
- [ ] 失败重试机制

### 3.6 Skills（必做）

- [ ] 市场机会分析 Skill
- [ ] 供应商筛选 Skill
- [ ] Listing 生成 Skill
- [ ] 内容日历 Skill
- [ ] 利润测算 Skill

### 3.7 MVP 不做

- ❌ 第三方员工 Marketplace 自由上架
- ❌ Amazon / Shopify 写入操作
- ❌ 自动发邮件 / 自动下单 / 自动上架
- ❌ 大规模 RPA
- ❌ 多语言客服自动执行
- ❌ 私有化部署
- ❌ 复杂分账结算

---

## 4. 阶段排期

### Phase 0：决策与体检（第 1 周）

**目标：把方向钉死，避免后期返工**

- [ ] **D1** Paperclip 仓库适配性体检
  - clone & 跑起来
  - 看数据模型（Workspace / Agent / Task 抽象）
  - 看是否支持多租户
  - 评估改造成本
- [ ] **D1** OpenMule 仓库适配性体检
  - 看 Agent / Task / Order 抽象
  - 看活跃度 & 文档完整度
  - 评估「fork 改造 vs 自研」工作量
- [ ] **D2-3** ArkClaw 接入实验
  - 注册一个 ArkClaw 实例
  - 跑通最简单的 Skill 调用
  - 评估 Bridge 开发难度
- [ ] **D4-5** 出最终架构图 + 数据模型设计稿
- [ ] **交付物**：技术决策文档 v1.0、架构图、数据库 ER 图

### Phase 1：MVP（第 2-7 周，6 周）

#### Week 2-3：基础设施 + 工作台骨架

- [ ] 基础设施：PG / Redis / MinIO / Logto
- [ ] Paperclip fork & 中文化
- [ ] 业务对象改造（Workspace / Issue → 一人公司 / 经营任务）
- [ ] 用户注册登录 + 多租户

#### Week 4：员工库 + 5 个员工模板

- [ ] `marketplace-service` 基础功能（fork OpenMule 或自研）
- [ ] 员工模板数据建模
- [ ] 5 个员工 Soul / Skill 定义
- [ ] 员工详情页 + 雇佣按钮

#### Week 5：ArkClaw Bridge + 任务执行

- [ ] `arkclaw-bridge-service` 开发
- [ ] 任务派发 → 执行 → 回调
- [ ] 任务状态机
- [ ] 执行日志

#### Week 6：Workflow + 交付物

- [ ] `workflow-service` 引擎
- [ ] 7 天冷启动 Workflow 实现
- [ ] 供应商开发 Workflow 实现
- [ ] 交付物中心 UI

#### Week 7：园区端 + 联调

- [ ] 园区管理台 MVP（总览 / 项目进度）
- [ ] 服务商介入手动标记
- [ ] 端到端联调
- [ ] Demo 准备

**交付物：可运行的 MVP，能完成「Demo 脚本」全流程**

### Phase 2：试点园区版（第 8-13 周，6 周）

- [ ] 接入 n8n（自动化）
- [ ] 接入 Playwright Worker（RPA）
- [ ] 接入 Langfuse（观测）
- [ ] 园区政策知识库
- [ ] 服务商管理 + 自动介入提醒
- [ ] 任务日志审计强化
- [ ] 用户反馈系统

### Phase 3：执行型员工（第 14-19 周）

- [ ] Shopify / Gmail / Google Sheets API 接入
- [ ] 高风险操作人工确认机制
- [ ] 客服 / 广告员工
- [ ] 执行型 Workflow（店铺运营复盘）

### Phase 4：Marketplace 开放（第 20 周后）

- [ ] 第三方员工审核机制
- [ ] 评分 / 评价
- [ ] 服务商分成结算（参考 `agent-exchange`）
- [ ] 安全扫描 / 权限审批

---

## 5. 数据模型（关键表）

### 5.1 核心表

```sql
-- 园区
parks (id, name, type, owner_id, created_at)

-- 一人公司 Workspace
workspaces (id, park_id, owner_id, name, business_type, created_at)

-- 员工模板（Marketplace 中的）
agent_templates (
  id, name, category, description,
  soul_prompt, skills, tools, permissions,
  output_schema, source_type, status
)

-- 员工实例（用户雇佣后）
agent_instances (
  id, template_id, workspace_id,
  name, config, memory, status, created_at
)

-- 任务
tasks (
  id, workspace_id, project_id, title, type,
  assigned_agent_id, status, input, output,
  created_by, created_at
)

-- Workflow 模板
workflows (id, name, description, steps, required_agents, output_schema)

-- 任务执行记录
task_runs (
  id, task_id, agent_id, arkclaw_run_id,
  status, logs, started_at, finished_at
)

-- 审计日志
audit_logs (
  id, actor_id, agent_id, action,
  target_type, target_id, payload, created_at
)
```

### 5.2 多租户隔离原则

每张业务表必须包含 `park_id` 或 `workspace_id`，所有查询强制带租户条件。

---

## 6. 团队与角色

### 6.1 最小配置（MVP 阶段）

| 角色 | 人数 | 主要职责 |
|---|---|---|
| 产品经理 | 1 | PRD / 需求 / Demo 脚本 |
| 全栈工程师 | 2 | Paperclip 改造 / 业务服务 |
| AI 工程师 | 1 | ArkClaw 员工配置 / Skill 开发 |
| 前端工程师 | 1 | 园区端 / 工作台 UI |
| 测试 | 0.5 | 联调 / 用户验收 |

### 6.2 关键依赖

- ArkClaw 平台账号 & 配额
- 至少 1 个园区合作方愿意做 PoC
- 5 个员工的业务专家访谈（选品 / 供应商 / Listing / 内容 / 财务）

---

## 7. 风险与应对

| 风险 | 等级 | 应对 |
|---|---|---|
| Paperclip 改造成本超预期 | 高 | Phase 0 必须完成体检；超预期则降级为 Multica fork 或自研 |
| OpenMule 机制参考不落地 | 低 | 已明确不作为 MVP 地基；后续仅在交易阶段借鉴机制 |
| ArkClaw 能力不足 | 中 | 复杂执行下沉到外部 Worker，ArkClaw 只做编排 |
| 园区客户付费意愿低 | 高 | 绑定招商价值，提供白标 + 看板，按园区年订阅收费 |
| 员工产出质量差 | 高 | Workflow 强约束输出结构；Langfuse 持续质量监控 |
| 多租户数据泄露 | 极高 | 表级强制租户字段；定期权限审计；高风险操作人工确认 |

---

## 8. 立即开始的 3 件事

1. **完成 Paperclip fork 初始骨架**（保留 org/goal/agent/task 主干）
2. **注册 ArkClaw 实例**，跑通一个 Hello World Skill
3. **启动 marketplace-service 自研最小闭环**（模板/安装/实例化）

---

## 9. 决策记录（ADR）

| 日期 | 决策 | 理由 |
|---|---|---|
| 2026-05-10 | 选 Paperclip 而非 Multica | 「AI 公司」隐喻匹配产品定位，且工程成熟度更高 |
| 2026-05-10 | OpenMule 不作为 MVP 地基 | 仓库成熟度不足，改为自研 marketplace 并仅参考其机制 |
| TBD | ArkClaw 不做主业务后端 | 保持「员工运行时」单一职责 |
| TBD | MVP 不开放第三方上架 | 安全 / 质量优先 |
| TBD | 高风险操作必须人工确认 | 跨境业务合规要求 |

---

## 10. 文档约定

- 所有架构变更必须更新本文档 + ADR
- 阶段交付物必须 Demo + Code Review
- PRD 与 EXECUTION 双向锚定（功能号对齐）

---

## 11. Phase 0 体检结果（2026-05-10）

### 11.1 结论摘要

- `paperclipai/paperclip`：**可作为主底座**
- `James4Ever0/openmule`：**不建议作为 MVP 核心依赖（仅保留机制参考）**
- 最终建议：`Paperclip + ArkClaw/OpenClaw + 自研 Marketplace/Workflow/Bridge`

### 11.2 证据（仓库活跃度与工程成熟度）

#### Paperclip

- GitHub 元数据（API）：
  - `pushed_at`: 2026-05-10
  - `stargazers_count`: 63,797
  - `forks_count`: 11,476
- 最近提交显示持续活跃（同日多次 PR 合并）。
- 工程体量完整：monorepo、`server` + `ui` + `packages/db` + plugins + tests + migrations。
- README 明确支持：
  - multi-company isolation
  - org chart / governance / budgets
  - approvals / audit / cost control

#### OpenMule

- GitHub 元数据（API）：
  - `pushed_at`: 2026-02-25
  - `stargazers_count`: 8
  - `forks_count`: 1
- 最近提交以 `Add files via upload` 为主，工程演进信号弱。
- 仓库主体内容是 proposal/docs 与实验性 relay 代码，缺少稳定的可运行全栈主工程。
- 本地结构未见完整可直接运行的 marketplace 主干（多为文档、提示词、生成代码样例）。

### 11.3 关键能力匹配度评估

| 能力项 | Paperclip | OpenMule | 结论 |
|---|---|---|---|
| AI 公司/组织治理模型 | 强 | 弱 | Paperclip 明显更匹配 PRD |
| 多租户/隔离抽象 | 强（company scoped） | 未形成可用工程能力 | 不能押注 OpenMule |
| 审计/治理/预算 | 强 | 提案级 | MVP 需直接落地，Paperclip 更稳 |
| 市场交易机制（理论） | 中 | 中（概念更像） | 可借鉴 OpenMule 机制，不作为地基 |
| 工程可落地性 | 高 | 低 | MVP 以可交付优先 |

### 11.4 决策落地（替换原“OpenMule 待体检”）

1. **主底座定为 Paperclip**（用户工作台 + 组织治理）
2. **Marketplace 改为自研最小闭环**（模板、详情、安装、实例化、权限声明）
3. **OpenMule 仅作为机制参考**（后续评分/交易/结算阶段借鉴）
4. **ArkClaw 仍为执行运行时**，通过 `arkclaw-bridge-service` 对接

### 11.5 影响到排期的调整

- Phase 0：已完成选型体检与决策
- Phase 1：删除“fork OpenMule”路径，改为“自研 marketplace-service”
- 预计影响：MVP 路径更确定，减少外部仓改造不确定性

---

**下一步**：按本结论执行 Week 2-3 基础搭建（Paperclip fork + 业务语义改造 + ArkClaw bridge skeleton）。
