import { NextResponse } from "next/server";

/**
 * marketplace [Run Now] 的承接点。
 *
 *   GET /launch/<agentKey>?intent=...&company=...
 *
 * 它做三件事：
 *   1) 找 paperclip 里 opc.cross-border-agents 插件的 UUID
 *   2) 找一个 company UUID（参数 > 第一家公司）
 *   3) 302 到 paperclip 的 /api/plugins/<uuid>/api/launch
 *
 * 这样 marketplace 卡片就只需要写 /launch/listing-pro?intent=...，
 * 不用关心 paperclip 那边的实例化 UUID。
 */

const WORKBENCH_BASE = process.env.NEXT_PUBLIC_WORKBENCH_BASE ?? "http://127.0.0.1:3101";
const PLUGIN_KEY = "opc.cross-border-agents";

// 简单 in-memory cache（dev 模式重启会清；生产部署到 edge 时可换 KV）
type CacheEntry = { pluginUuid: string; companyId: string; cachedAt: number };
let cache: CacheEntry | null = null;
const CACHE_TTL_MS = 60_000;

async function resolveIds(forceCompanyId?: string): Promise<CacheEntry> {
  if (cache && Date.now() - cache.cachedAt < CACHE_TTL_MS && !forceCompanyId) {
    return cache;
  }

  const [pluginsRes, companiesRes] = await Promise.all([
    fetch(`${WORKBENCH_BASE}/api/plugins`, { cache: "no-store" }),
    fetch(`${WORKBENCH_BASE}/api/companies`, { cache: "no-store" }),
  ]);

  if (!pluginsRes.ok) throw new Error(`paperclip plugins API ${pluginsRes.status}`);
  if (!companiesRes.ok) throw new Error(`paperclip companies API ${companiesRes.status}`);

  const plugins = (await pluginsRes.json()) as Array<{ id: string; pluginKey: string }>;
  const companies = (await companiesRes.json()) as Array<{ id: string; name: string }>;

  const plugin = plugins.find((p) => p.pluginKey === PLUGIN_KEY);
  if (!plugin) {
    throw new Error(`paperclip 里找不到插件 ${PLUGIN_KEY}，请先 install plugin-cross-border-agents`);
  }

  let companyId = forceCompanyId;
  if (!companyId) {
    if (companies.length === 0) {
      throw new Error("paperclip 里还没有任何 company；请先 POST /api/companies 建一家");
    }
    companyId = companies[0].id;
  }

  const entry: CacheEntry = {
    pluginUuid: plugin.id,
    companyId,
    cachedAt: Date.now(),
  };
  if (!forceCompanyId) cache = entry;
  return entry;
}

function errorPage(message: string, status = 500): Response {
  const body = `<!doctype html><meta charset="utf-8"><title>启动失败</title>
<style>
  body{font-family:'Newsreader',Georgia,serif;background:#F4EFE3;color:#0E0E0C;
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    min-height:100vh;margin:0;padding:2rem;text-align:center}
  h1{font-family:'Fraunces',Georgia,serif;font-size:2rem;font-weight:500;margin:0 0 1rem;color:#D04A2E}
  p{max-width:38rem;line-height:1.6;color:#3A3833}
  pre{background:#0E0E0C;color:#F4EFE3;padding:1rem;font-family:'JetBrains Mono',monospace;font-size:.85em;text-align:left;max-width:36rem;overflow:auto}
  a{color:#D04A2E;font-family:'JetBrains Mono',monospace;font-size:.85em}
</style>
<h1>启动失败</h1>
<p>marketplace 没法把你的任务交给 paperclip。可能的原因：</p>
<pre>${escapeHtml(message)}</pre>
<p>请检查 <code>http://127.0.0.1:3101</code> 是否在跑，以及 <code>opc.cross-border-agents</code> 插件是否已安装。</p>
<p><a href="/">← 回首页</a></p>`;
  return new Response(body, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET(
  request: Request,
  ctx: { params: Promise<{ agent: string }> },
): Promise<Response> {
  const { agent } = await ctx.params;
  const url = new URL(request.url);
  const intent = url.searchParams.get("intent") ?? "";
  const forceCompanyId = url.searchParams.get("company") ?? undefined;

  if (!agent) {
    return errorPage("缺少 agent 参数", 400);
  }

  let ids: CacheEntry;
  try {
    ids = await resolveIds(forceCompanyId);
  } catch (err) {
    return errorPage(err instanceof Error ? err.message : String(err));
  }

  const target = new URL(
    `${WORKBENCH_BASE}/api/plugins/${ids.pluginUuid}/api/launch`,
  );
  target.searchParams.set("agent", agent);
  if (intent) target.searchParams.set("intent", intent);
  target.searchParams.set("companyId", ids.companyId);

  // 拿到 JSON body 后再二次跳转——paperclip 主机不转发 plugin 自定义 Location 头，
  // 所以我们只能用 body.redirectUrl
  let body: { redirectUrl?: string; agentId?: string; sessionId?: string };
  try {
    const r = await fetch(target.toString(), {
      redirect: "manual",
      cache: "no-store",
    });
    body = (await r.json()) as typeof body;
  } catch (err) {
    return errorPage(
      `调 paperclip /api/plugins/.../api/launch 失败：${err instanceof Error ? err.message : String(err)}`,
    );
  }

  if (!body.redirectUrl) {
    return errorPage(
      `paperclip 返回的不是预期 JSON：${JSON.stringify(body).slice(0, 300)}`,
    );
  }

  return NextResponse.redirect(body.redirectUrl, { status: 302 });
}
