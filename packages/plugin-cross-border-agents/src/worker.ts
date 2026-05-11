import { definePlugin, runWorker } from "@paperclipai/plugin-sdk";
import type { PluginApiRequestInput, PluginApiResponse, PluginEvent } from "@paperclipai/plugin-sdk";
import { AGENT_KEYS, AGENT_SKILLS, DOWNSTREAM_MAP, buildDispatchPrompt } from "./agent-roster";

const WORKBENCH_BASE = "http://127.0.0.1:3101";

const plugin = definePlugin({
  async setup(ctx) {
    setLaunchCtx(ctx);

    const reconcileAll = async (companyId: string, label: string): Promise<void> => {
      for (const key of AGENT_KEYS) {
        try {
          const result = await ctx.agents.managed.reconcile(key, companyId);
          ctx.logger.info(`agent reconciled: ${key} → ${label}`, {
            status: result.status,
            agentId: result.agentId,
            boundSkill: AGENT_SKILLS[key],
          });
        } catch (err) {
          ctx.logger.error(`agent reconcile failed: ${key} → ${label}`, {
            error: err instanceof Error ? err.message : String(err),
          });
        }
      }
    };

    const companies = await ctx.companies.list();
    ctx.logger.info(
      `OPC agents: backfilling ${AGENT_KEYS.length} employees into ${companies.length} existing company(ies)`,
    );
    for (const c of companies) {
      await reconcileAll(c.id, c.name ?? c.id);
    }

    ctx.events.on("company.created", async (event) => {
      const companyId = event.entityId;
      if (!companyId) return;
      ctx.logger.info(`OPC agents: company.created → onboarding employees into ${companyId}`);
      await reconcileAll(companyId, companyId);
    });

    ctx.actions.register("reconcile-now", async (params) => {
      const companyId =
        typeof params?.companyId === "string" ? params.companyId : null;
      const targets = companyId
        ? [{ id: companyId, name: companyId }]
        : await ctx.companies.list();
      for (const c of targets) {
        await reconcileAll(c.id, c.name ?? c.id);
      }
      return {
        reconciledCompanies: targets.length,
        agents: AGENT_KEYS.length,
      };
    });

    // Force-refresh: reset() + reconcile() = paperclip 会用最新 manifest
    // 重写 agent declaration (instructions / adapter / capabilities …)。
    // 用于 plugin upgrade 后需要把新 SKILL.md inline 推到磁盘 AGENTS.md 时调用。
    ctx.actions.register("force-refresh", async (params) => {
      const companyId =
        typeof params?.companyId === "string" ? params.companyId : null;
      const targets = companyId
        ? [{ id: companyId, name: companyId }]
        : await ctx.companies.list();
      let refreshed = 0;
      for (const c of targets) {
        for (const key of AGENT_KEYS) {
          try {
            await ctx.agents.managed.reset(key, c.id);
            await ctx.agents.managed.reconcile(key, c.id);
            refreshed += 1;
          } catch (err) {
            ctx.logger.error(`force-refresh failed: ${key} → ${c.id}`, {
              error: err instanceof Error ? err.message : String(err),
            });
          }
        }
      }
      return { refreshed, companies: targets.length };
    });

    ctx.data.register("status", async () => ({
      managedAgents: AGENT_KEYS,
      bindings: AGENT_SKILLS,
      downstream: DOWNSTREAM_MAP,
      version: "0.3.0",
    }));

    // ─── Dispatcher ───────────────────────────────────────────────
    // 监听 issue.updated；当顶层 marketplace issue 跑完 (status=done)，
    // 按 DOWNSTREAM_MAP 自动 spawn 子 issue 给下游 agent。
    //
    // 防循环：只处理 parentId 为空的顶层 issue。dispatch 出来的子 issue
    // 自带 parentId，所以它跑完时 dispatcher 不会再次派活。
    ctx.events.on("issue.updated", async (event: PluginEvent) => {
      try {
        await handleIssueUpdated(event);
      } catch (err) {
        ctx.logger.error("dispatcher: issue.updated handler crashed", {
          eventId: event.eventId,
          entityId: event.entityId,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    });

    async function handleIssueUpdated(event: PluginEvent): Promise<void> {
      const issueId = event.entityId;
      if (!issueId) return;
      const payload = event.payload as
        | { patch?: { status?: string }; status?: string }
        | undefined;
      const newStatus = payload?.patch?.status ?? payload?.status;
      if (newStatus !== "done") return;

      const issue = await ctx.issues.get(issueId, event.companyId);
      if (!issue) return;
      // 只对顶层 issue 派活
      if (issue.parentId) return;
      // 只对我们 plugin 起的 issue 派活
      const originKind = (issue as { originKind?: string }).originKind ?? "";
      if (!originKind.startsWith("plugin:opc.cross-border-agents")) return;
      // 必须有 assignee（即上游 agent）
      if (!issue.assigneeAgentId) return;
      // 用户可在 marketplace 选择「只跑这个 agent，不要接力」，
      // 那条 issue 的 originId 会带 :nodispatch 后缀
      const originId = (issue as { originId?: string | null }).originId ?? "";
      if (originId.endsWith(":nodispatch")) {
        ctx.logger.info("dispatcher: skipped — user opted out", { issueId, originId });
        return;
      }

      // 拿上游 agent 的 key
      const upstreamKey = await resolveAgentKey(issue.assigneeAgentId, event.companyId);
      if (!upstreamKey) {
        ctx.logger.debug("dispatcher: assignee is not a managed agent", {
          issueId,
          assigneeAgentId: issue.assigneeAgentId,
        });
        return;
      }

      const downstream = DOWNSTREAM_MAP[upstreamKey] ?? [];
      if (downstream.length === 0) {
        ctx.logger.debug("dispatcher: upstream has no downstream", { upstreamKey });
        return;
      }

      ctx.logger.info("dispatcher: upstream done, spawning downstream", {
        issueId,
        upstreamKey,
        downstreamKeys: downstream,
      });

      for (const downstreamKey of downstream) {
        try {
          const resolution = await ctx.agents.managed.get(downstreamKey, event.companyId);
          if (!resolution.agentId) {
            ctx.logger.warn("dispatcher: downstream agent not resolved", { downstreamKey });
            continue;
          }
          const upstreamIdentifier =
            (issue as { identifier?: string }).identifier ?? `issue ${issueId.slice(0, 8)}`;
          const { title, description } = buildDispatchPrompt(
            upstreamKey,
            downstreamKey,
            upstreamIdentifier,
            issue.title ?? "(no title)",
          );

          const childIssue = await ctx.issues.create({
            companyId: event.companyId,
            parentId: issueId,
            title,
            description,
            status: "todo",
            priority: "normal",
            assigneeAgentId: resolution.agentId,
            originKind: "plugin:opc.cross-border-agents:dispatch",
            originId: `dispatch:${issueId}:${downstreamKey}`,
          });

          await ctx.issues.requestWakeup(childIssue.id, event.companyId, {
            reason: `dispatch chain: ${upstreamKey} → ${downstreamKey}`,
            contextSource: "plugin:opc.cross-border-agents:dispatcher",
          });

          ctx.logger.info("dispatcher: child issue spawned", {
            upstreamKey,
            downstreamKey,
            parentId: issueId,
            childId: childIssue.id,
          });
        } catch (err) {
          ctx.logger.error("dispatcher: failed to spawn child", {
            upstreamKey,
            downstreamKey,
            error: err instanceof Error ? err.message : String(err),
          });
        }
      }
    }

    // ─── Failure auto-retry ───────────────────────────────────────
    // 当 agent run 失败时，自动 spawn 一个 retry issue（同一 agent，附带
    // 失败原因 + 原 prompt）。最多 retry 一次 —— 用 originId 编码 attempt
    // 计数，第 2 次失败时不再重试，让人介入。
    //
    // 只对顶层 marketplace issue 重试；dispatch / 子任务 / retry 本身的
    // 失败不会触发新的 retry。
    const MAX_RETRY_ATTEMPTS = 1;

    ctx.events.on("agent.run.failed", async (event: PluginEvent) => {
      try {
        await handleRunFailed(event);
      } catch (err) {
        ctx.logger.error("retry: agent.run.failed handler crashed", {
          eventId: event.eventId,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    });

    async function handleRunFailed(event: PluginEvent): Promise<void> {
      const payload = event.payload as
        | {
            issueId?: string | null;
            agentId?: string;
            error?: string | null;
            errorCode?: string | null;
            runId?: string;
          }
        | undefined;
      const failedIssueId = payload?.issueId;
      if (!failedIssueId) return;

      const failedIssue = await ctx.issues.get(failedIssueId, event.companyId);
      if (!failedIssue) return;

      const originKind = (failedIssue as { originKind?: string }).originKind ?? "";
      // 只对 marketplace 起的顶层 issue 自动重试
      if (originKind !== "plugin:opc.cross-border-agents:marketplace") {
        ctx.logger.debug("retry: skipped — not a marketplace issue", {
          failedIssueId,
          originKind,
        });
        return;
      }
      if (!failedIssue.assigneeAgentId) return;

      // attempt 计数：从 originId 解析
      const originId = (failedIssue as { originId?: string | null }).originId ?? "";
      const attemptMatch = originId.match(/attempt-(\d+)/);
      const currentAttempt = attemptMatch ? Number(attemptMatch[1]) : 1;
      if (currentAttempt > MAX_RETRY_ATTEMPTS) {
        ctx.logger.info("retry: skipped — already exceeded MAX_RETRY_ATTEMPTS", {
          failedIssueId,
          currentAttempt,
        });
        return;
      }

      const upstreamKey = await resolveAgentKey(failedIssue.assigneeAgentId, event.companyId);
      if (!upstreamKey) return;

      const errMsg = payload?.error || payload?.errorCode || "unknown error";
      const failedIdentifier =
        (failedIssue as { identifier?: string }).identifier ?? failedIssueId.slice(0, 8);

      const nextAttempt = currentAttempt + 1;
      const retryDescription =
        `## ⚠️ 自动重试 (attempt ${nextAttempt} / ${MAX_RETRY_ATTEMPTS + 1})\n\n` +
        `上一次（${failedIdentifier}）跑失败了：\n\n` +
        `\`\`\`\n${errMsg}\n\`\`\`\n\n` +
        `请重新尝试。如果失败原因是输入不够，请在 comment 里写 \`[需核实]\` 标记缺什么，` +
        `而不是硬猜。下面是原始任务：\n\n---\n\n` +
        (failedIssue.description ?? "(原任务无描述)");

      try {
        const retryIssue = await ctx.issues.create({
          companyId: event.companyId,
          parentId: failedIssueId,
          title: `[重试 #${nextAttempt}] ${failedIssue.title ?? upstreamKey}`,
          description: retryDescription,
          status: "todo",
          priority: "high",
          assigneeAgentId: failedIssue.assigneeAgentId,
          originKind: "plugin:opc.cross-border-agents:retry",
          originId: `retry-of:${failedIssueId}:attempt-${nextAttempt}`,
        });

        await ctx.issues.requestWakeup(retryIssue.id, event.companyId, {
          reason: `auto-retry after failure: ${failedIdentifier}`,
          contextSource: "plugin:opc.cross-border-agents:retry",
        });

        ctx.logger.info("retry: spawned retry issue", {
          failedIssueId,
          retryIssueId: retryIssue.id,
          attempt: nextAttempt,
          upstreamKey,
        });
      } catch (err) {
        ctx.logger.error("retry: failed to spawn retry issue", {
          failedIssueId,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    async function resolveAgentKey(
      agentId: string,
      companyId: string,
    ): Promise<string | null> {
      // 反查：遍历 managed agent，谁的 agentId 等于上游 issue 的 assigneeAgentId
      // 就是它对应的 key。companyId 范围内查找。
      for (const key of AGENT_KEYS) {
        try {
          const resolution = await ctx.agents.managed.get(key, companyId);
          if (resolution.agentId === agentId) return key;
        } catch {
          // ignore — 该 key 可能在该 company 还没 reconcile
        }
      }
      return null;
    }
  },

  async onHealth() {
    return { status: "ok", message: "OPC cross-border-agents worker live" };
  },

  async onApiRequest(input: PluginApiRequestInput): Promise<PluginApiResponse> {
    if (input.routeKey !== "launch") {
      return { status: 404, body: { error: "unknown route" } };
    }

    const q = input.query;
    const getOne = (k: string): string | undefined => {
      const v = q[k];
      return Array.isArray(v) ? v[0] : v;
    };

    const agentKey = getOne("agent");
    const intent = getOne("intent") ?? "（从 marketplace 触发的任务，请按你的 SOP 起步。）";
    const dispatchFlag = (getOne("dispatch") ?? "on").toLowerCase();
    const dispatchEnabled = dispatchFlag !== "off" && dispatchFlag !== "0" && dispatchFlag !== "false";
    const companyId = input.companyId;

    if (!agentKey) {
      return jsonHtml(
        "缺少 agent 参数",
        `必填 query: <code>agent</code>。可选: <code>companyId</code>, <code>intent</code>。`,
        400,
      );
    }
    if (!AGENT_KEYS.includes(agentKey)) {
      return jsonHtml(
        `没有员工 "${agentKey}"`,
        `当前 8 位员工：${AGENT_KEYS.join(", ")}`,
        404,
      );
    }

    // 通过 worker context 调度
    // onApiRequest 没法直接拿 ctx，但 setup 里把 ctx 暴露给闭包就可以
    const launchCtx = getLaunchCtx();
    if (!launchCtx) {
      return jsonHtml("worker 未就绪", "请稍候重试", 503);
    }

    try {
      const resolution = await launchCtx.agents.managed.get(agentKey, companyId);
      if (!resolution.agentId || !resolution.agent) {
        return jsonHtml(
          `员工 ${agentKey} 还没在该 company 落地`,
          `companyId=${companyId} · 请先确认 plugin 已 reconcile`,
          404,
        );
      }
      const agentId = resolution.agentId;

      // paperclip 用 issuePrefix 来路由公司，不是 UUID
      const company = await launchCtx.companies.get(companyId);
      const prefix = company?.issuePrefix ?? "";
      if (!prefix) {
        return jsonHtml(
          `公司没有 issuePrefix`,
          `companyId=${companyId} · paperclip 路由需要它`,
          500,
        );
      }

      // paperclip 的 heartbeat SOP 要求 agent "no issue → exit"。
      // 所以 marketplace 触发必须建一个 issue + wakeup，agent 才会真正干活。
      // chat session 路径（sessions.sendMessage）会被 heartbeat 忽略。
      const firstLine = intent.split("\n")[0]?.slice(0, 80) ?? `Marketplace task for ${agentKey}`;
      const issue = await launchCtx.issues.create({
        companyId,
        title: firstLine || `Marketplace task: ${agentKey}`,
        description: intent,
        status: "todo",
        priority: "high",
        assigneeAgentId: agentId,
        originKind: "plugin:opc.cross-border-agents:marketplace",
        originId: dispatchEnabled
          ? `marketplace:${agentKey}`
          : `marketplace:${agentKey}:nodispatch`,
      });

      await launchCtx.issues.requestWakeup(issue.id, companyId, {
        reason: `marketplace launch: ${agentKey}${dispatchEnabled ? "" : " (no-dispatch)"}`,
        contextSource: "plugin:opc.cross-border-agents",
      });

      const redirectUrl =
        `${WORKBENCH_BASE}/${prefix}/issues/${issue.id}?via=marketplace`;

      launchCtx.logger.info(`marketplace launch ok`, {
        agentKey,
        agentId,
        companyId,
        issueId: issue.id,
        dispatchEnabled,
      });

      return {
        status: 302,
        headers: { Location: redirectUrl },
        body: { redirectUrl, agentId, issueId: issue.id, companyId },
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      launchCtx.logger.error(`launch failed for ${agentKey}`, { error: msg, companyId });
      return jsonHtml("启动失败", msg, 500);
    }
  },
});

// ---------------------------------------------------------------------------
// 让 onApiRequest 能访问 setup() 里的 ctx
// ---------------------------------------------------------------------------
let LAUNCH_CTX: Parameters<NonNullable<Parameters<typeof definePlugin>[0]["setup"]>>[0] | null = null;
function setLaunchCtx(ctx: typeof LAUNCH_CTX): void {
  LAUNCH_CTX = ctx;
}
function getLaunchCtx(): NonNullable<typeof LAUNCH_CTX> | null {
  return LAUNCH_CTX;
}

function jsonHtml(title: string, body: string, status = 200): PluginApiResponse {
  return {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8" },
    body: `<!doctype html><meta charset="utf-8"><title>${title}</title>
<style>
  body{font-family:'Newsreader',serif;background:#F4EFE3;color:#0E0E0C;
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    min-height:100vh;margin:0;padding:2rem;text-align:center}
  h1{font-family:'Fraunces',serif;font-size:2rem;font-weight:500;margin:0 0 1rem}
  p{max-width:38rem;line-height:1.5;color:#3A3833}
  code{background:#0E0E0C;color:#F4EFE3;padding:.15rem .4rem;font-size:.9em}
  a{color:#D04A2E}
</style>
<h1>${title}</h1>
<p>${body}</p>
<p><a href="/">← 回工作台首页</a></p>`,
  };
}

export default plugin;
runWorker(plugin, import.meta.url);
