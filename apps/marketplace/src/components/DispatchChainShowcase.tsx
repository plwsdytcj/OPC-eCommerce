import { COMPANY_PREFIX, SAMPLE_CHAIN, WORKBENCH_BASE } from "@/data/agents";

const AGENT_META: Record<string, { name: string; emoji: string }> = {
  "listing-pro": { name: "Listing 优化员", emoji: "📝" },
  "keyword": { name: "关键词员", emoji: "🔑" },
  "cfo": { name: "Ecom CFO", emoji: "💰" },
};

function issueUrl(issueId: string): string {
  return `${WORKBENCH_BASE}/${COMPANY_PREFIX}/issues/${issueId}?via=marketplace-hero`;
}

export function DispatchChainShowcase() {
  const { upstream, downstreams } = SAMPLE_CHAIN;
  const up = AGENT_META[upstream.agentKey];

  return (
    <section
      id="chain"
      className="rule-thin bg-bg-card"
      aria-labelledby="chain-title"
    >
      <div className="page-container py-16 md:py-20">
        <div className="grid grid-cols-12 gap-6 fade-up">
          <div className="col-span-12 md:col-span-5">
            <div className="serial mb-4">第 002 节 · 数字员工不再单兵</div>
            <h2
              id="chain-title"
              className="font-display text-[clamp(1.75rem,4vw,3.25rem)] leading-[1.05] font-medium tracking-tight"
            >
              <span className="block">不是雇</span>
              <span
                className="block italic"
                style={{ fontVariationSettings: '"opsz" 144, "SOFT" 80, "WONK" 1' }}
              >
                8 个独立工
              </span>
              <span className="block">
                是把它们 <span className="text-signal">串成小队</span>
              </span>
            </h2>
            <p className="mt-6 font-body text-base md:text-lg leading-snug text-ink-soft max-w-md">
              你只下一次单。上游 agent 一旦交付完，paperclip 内部的 dispatcher
              会自动把下游任务派给「关键词员」「CFO」——
              <br />
              <span className="italic">不需要你再开 8 次会。</span>
            </p>
            <p className="mt-4 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-ink-soft">
              下方是一次真实跑过的链路，点 OPC-XX 看 paperclip 里的产出。
            </p>
          </div>

          {/* 右侧：链路图 */}
          <div className="col-span-12 md:col-span-7">
            <div className="grid grid-cols-12 gap-3 md:gap-4 items-stretch">
              {/* 上游节点 */}
              <div className="col-span-12 md:col-span-5">
                <ChainNode
                  badge="UPSTREAM"
                  badgeColor="bg-ink text-bg"
                  emoji={up?.emoji ?? "·"}
                  agentName={up?.name ?? upstream.agentKey}
                  agentKey={upstream.agentKey}
                  issueId={upstream.issueId}
                  identifier={upstream.identifier}
                  status="done"
                  note="第 1 步：你在 marketplace 点的 [Run]"
                />
              </div>

              {/* 连接线（桌面） */}
              <div
                className="hidden md:flex md:col-span-2 items-center justify-center"
                aria-hidden
              >
                <Connector />
              </div>

              {/* 下游 stack */}
              <div className="col-span-12 md:col-span-5 flex flex-col gap-3 md:gap-4">
                {downstreams.map((d, i) => {
                  const meta = AGENT_META[d.agentKey];
                  return (
                    <ChainNode
                      key={d.issueId}
                      badge={`AUTO #${i + 1}`}
                      badgeColor="bg-signal text-bg"
                      emoji={meta?.emoji ?? "·"}
                      agentName={meta?.name ?? d.agentKey}
                      agentKey={d.agentKey}
                      issueId={d.issueId}
                      identifier={d.identifier}
                      status="auto-spawned"
                      note={`第 2 步：dispatcher 自动派活`}
                    />
                  );
                })}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2 font-mono text-[0.65rem] uppercase tracking-[0.15em] text-ink-soft">
              <Stat n="1" label="人为操作" />
              <Stat n="3" label="agent 协作" emphasis />
              <Stat n="0" label="prompt 重写" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ChainNode({
  badge,
  badgeColor,
  emoji,
  agentName,
  agentKey,
  issueId,
  identifier,
  status,
  note,
}: {
  badge: string;
  badgeColor: string;
  emoji: string;
  agentName: string;
  agentKey: string;
  issueId: string;
  identifier: string;
  status: "done" | "auto-spawned";
  note: string;
}) {
  return (
    <a
      href={issueUrl(issueId)}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-bg-card border-2 border-rule p-4 hover:border-signal transition-colors h-full"
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <span
          className={`font-mono text-[0.6rem] uppercase tracking-[0.18em] px-2 py-0.5 ${badgeColor}`}
        >
          {badge}
        </span>
        <span className="font-mono text-[0.65rem] text-ink-soft group-hover:text-signal">
          {identifier} ↗
        </span>
      </div>
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-2xl leading-none">{emoji}</span>
        <span className="font-display text-lg md:text-xl font-medium leading-tight">
          {agentName}
        </span>
      </div>
      <p className="font-mono text-[0.6rem] text-ink-soft tracking-wider">
        @{agentKey}
      </p>
      <p className="mt-3 font-body text-xs text-ink-soft leading-snug">
        {note}
      </p>
      <p className="mt-2 font-mono text-[0.6rem] uppercase tracking-[0.15em]">
        {status === "done" ? (
          <span className="text-ink">✓ done</span>
        ) : (
          <span className="text-signal animate-pulse">▸ auto-spawned</span>
        )}
      </p>
    </a>
  );
}

function Connector() {
  return (
    <svg
      viewBox="0 0 80 200"
      className="w-full h-full max-h-[180px]"
      preserveAspectRatio="none"
    >
      <line
        x1="0"
        y1="100"
        x2="40"
        y2="100"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-rule"
      />
      <line
        x1="40"
        y1="100"
        x2="40"
        y2="40"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-rule"
      />
      <line
        x1="40"
        y1="100"
        x2="40"
        y2="160"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-rule"
      />
      <line
        x1="40"
        y1="40"
        x2="80"
        y2="40"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-signal"
      />
      <line
        x1="40"
        y1="160"
        x2="80"
        y2="160"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-signal"
      />
      <circle cx="40" cy="100" r="3" fill="currentColor" className="text-ink" />
      <polygon
        points="80,40 74,36 74,44"
        fill="currentColor"
        className="text-signal"
      />
      <polygon
        points="80,160 74,156 74,164"
        fill="currentColor"
        className="text-signal"
      />
    </svg>
  );
}

function Stat({
  n,
  label,
  emphasis,
}: {
  n: string;
  label: string;
  emphasis?: boolean;
}) {
  return (
    <div className="rule-hair pt-2">
      <div
        className={
          emphasis
            ? "font-display text-3xl tabular-nums text-signal font-medium"
            : "font-display text-3xl tabular-nums font-medium"
        }
      >
        {n}
      </div>
      <div className="mt-1">{label}</div>
    </div>
  );
}
