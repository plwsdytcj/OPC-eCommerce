import { definePlugin, runWorker } from "@paperclipai/plugin-sdk";
import type { PluginApiRequestInput, PluginApiResponse } from "@paperclipai/plugin-sdk";
import { AGENT_KEYS, AGENT_SKILLS } from "./agent-roster";

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

    ctx.data.register("status", async () => ({
      managedAgents: AGENT_KEYS,
      bindings: AGENT_SKILLS,
      version: "0.1.0",
    }));
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

      const session = await launchCtx.agents.sessions.create(agentId, companyId, {
        reason: `marketplace launch: ${agentKey}`,
      });

      await launchCtx.agents.sessions.sendMessage(session.sessionId, companyId, {
        prompt: intent,
        reason: "marketplace launch",
      });

      const redirectUrl =
        `${WORKBENCH_BASE}/${prefix}/agents/${agentId}` +
        `?session=${session.sessionId}&via=marketplace`;

      launchCtx.logger.info(`marketplace launch ok`, {
        agentKey,
        agentId,
        companyId,
        sessionId: session.sessionId,
      });

      return {
        status: 302,
        headers: { Location: redirectUrl },
        body: { redirectUrl, agentId, sessionId: session.sessionId, companyId },
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
