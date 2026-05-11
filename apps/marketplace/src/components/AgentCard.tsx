import type { Agent } from "@/data/agents";
import { COMPANY_PREFIX, WORKBENCH_BASE } from "@/data/agents";

function buildLaunchUrl(agent: Agent): string {
  if (agent.status !== "live" || !agent.agentKey) return "#";
  const params = new URLSearchParams({
    intent: `请按你的 SOP 帮我开始 ${agent.name} 的工作。`,
  });
  return `/launch/${agent.agentKey}?${params.toString()}`;
}

function buildSampleUrl(agent: Agent): string | null {
  if (!agent.sampleIssueId) return null;
  return `${WORKBENCH_BASE}/${COMPANY_PREFIX}/issues/${agent.sampleIssueId}?via=marketplace-sample`;
}

export function AgentCard({ agent, index }: { agent: Agent; index: number }) {
  const live = agent.status === "live";
  const href = buildLaunchUrl(agent);
  const sampleHref = buildSampleUrl(agent);
  const isFree = agent.price.low === 0 && agent.price.high === 0;
  const priceLabel = isFree
    ? (live ? "内测免费" : "—")
    : agent.price.low === agent.price.high
      ? `${agent.price.low} / run`
      : `${agent.price.low}–${agent.price.high} / run`;

  return (
    <article
      className="task-card group relative bg-bg-card border-2 border-rule p-5 fade-up flex flex-col"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="task-card-shadow" />

      {/* HEAD */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <h3 className="font-display text-xl md:text-2xl font-medium tracking-tight leading-tight truncate">
            {agent.name}
            <span className="ml-2 font-mono text-[0.7rem] text-ink-soft tracking-wider align-middle">
              {agent.handle}
            </span>
          </h3>
        </div>
        <Badge kind={agent.badge} live={live} />
      </div>

      {/* TAGLINE */}
      <p className="font-body text-sm text-ink-soft leading-snug line-clamp-2 min-h-[2.5rem]">
        {agent.tagline}
      </p>

      {/* SHOWCASE STRIP */}
      <div className="mt-4 grid grid-cols-5 gap-1.5">
        {agent.showcase.slice(0, 5).map((s, i) => (
          <Thumbnail key={i} s={s} />
        ))}
        {Array.from({ length: Math.max(0, 5 - agent.showcase.length) }).map(
          (_, i) => (
            <div
              key={`pad-${i}`}
              className="aspect-square border border-rule-soft bg-bg/40"
            />
          ),
        )}
      </div>

      {/* REAL SAMPLE — 真实交付物链接（只有 sampleIssueId 才显示）*/}
      {sampleHref && agent.sampleSummary && (
        <a
          href={sampleHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 -mx-2 px-2 py-2 group/sample block border border-rule-soft hover:border-signal hover:bg-bg/60 transition-colors"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-signal animate-pulse" />
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-ink-soft group-hover/sample:text-signal">
              已跑过一次真实任务
            </span>
            <span className="ml-auto font-mono text-[0.7rem] text-ink-soft group-hover/sample:text-signal">
              ↗
            </span>
          </div>
          <p className="font-body text-xs text-ink-soft leading-snug line-clamp-2">
            {agent.sampleSummary}
          </p>
        </a>
      )}

      {/* FOOT */}
      <div className="mt-5 flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <span className="font-mono text-[0.65rem] uppercase tracking-widest text-ink-soft">
            {agent.category}
          </span>
          <span className="font-mono text-sm tabular-nums font-medium">
            {priceLabel}
          </span>
        </div>
        {live ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-ink text-bg px-4 py-2 font-mono text-xs uppercase tracking-wider hover:bg-signal transition-colors"
          >
            Run
            <span aria-hidden>↗</span>
          </a>
        ) : (
          <span className="inline-flex items-center gap-1.5 border border-rule-soft px-4 py-2 font-mono text-xs uppercase tracking-wider text-ink-soft">
            soon
          </span>
        )}
      </div>
    </article>
  );
}

function Badge({
  kind,
  live,
}: {
  kind: Agent["badge"];
  live: boolean;
}) {
  const map: Record<Agent["badge"], string> = {
    OPC: "bg-signal text-bg",
    Pro: "bg-ocean text-bg",
    Beta: "bg-bg border border-rule text-ink",
  };
  return (
    <span
      className={
        "shrink-0 font-mono text-[0.6rem] uppercase tracking-[0.18em] px-2 py-1 " +
        map[kind] +
        (!live && kind !== "Beta" ? " opacity-60" : "")
      }
    >
      {kind}
    </span>
  );
}

function Thumbnail({ s }: { s: { label: string; hue: string; ink?: string } }) {
  const ink = s.ink ?? "#F4EFE3";
  return (
    <div
      className="relative aspect-square border border-rule-soft overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${s.hue} 0%, ${s.hue} 60%, rgba(0,0,0,0.25) 100%)`,
      }}
      aria-hidden
    >
      {/* mock grid texture */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent 0 6px, rgba(255,255,255,0.08) 6px 7px)",
        }}
      />
      <span
        className="absolute bottom-0.5 left-1 right-1 font-mono text-[0.55rem] uppercase tracking-wider truncate"
        style={{ color: ink }}
      >
        {s.label}
      </span>
    </div>
  );
}
