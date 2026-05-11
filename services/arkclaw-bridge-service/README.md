# arkclaw-bridge-service — FROZEN (V0.1 reference)

**状态**：🧊 冻结中，不要 `pnpm dev` 这个服务。
**冻结日期**：2026-05-10（V0.2 大改造）
**原因**：架构演进到「paperclip 为底座 + OPC 插件」后，bridge 暂时不在黄金路径上。

## 为什么不删

里面有 ~600 行可复用的 IP：

| 文件 | 价值 |
|---|---|
| `src/arkclaw/dispatch.ts` | mock + real dispatch 切换、placeholder 检测 |
| `src/workers/run-poller.ts` | 兜底轮询：30s 周期、超时标 timed_out、stuck 状态恢复 |
| `src/routes/callbacks.ts` | ArkClaw 回调签名校验、状态机迁移 |
| `src/audit.ts` | 审计写法（每次状态变更落 audit_logs） |

如果将来要把跨境业务交给远程 ArkClaw 运行时执行，这些代码可以 80% 复用。

## 复活路径（Phase 2 决定）

二选一：

**A) 重写成 paperclip 插件**
```
packages/plugin-arkclaw-bridge/
  ├── src/
  │   ├── manifest.ts        # capabilities: ["agent.tools.register","http.outbound","jobs.schedule"]
  │   ├── worker.ts          # ports dispatch.ts + run-poller.ts logic
  │   └── tools/
  │       └── arkclaw-run.ts # exposes "arkclaw.run" tool to paperclip agents
  └── package.json
```

**B) 直接删除**
如果 paperclip 内置的 agent runtime + sandbox SDK + plugin worker 已经满足跨境业务的所有 LLM/工具调用负载，归档后删。

## 当前不要做的

- ❌ 不要在 `turbo dev` / `pnpm dev` 里启动它
- ❌ 不要往这里加新功能
- ❌ 不要让它消费 `task_runs` 表（那张表也属于 V0.1 schema，由 `packages/db` 统一处理）

## 怎么完整启动它（仅当你需要排错 V0.1 历史问题时）

```bash
cd services/arkclaw-bridge-service
RUN_POLLER_ENABLED=false pnpm dev
```
