import type { Task } from "@/data/tasks";

function buildLaunchUrl(task: Task): string {
  if (task.status !== "live" || !task.agentKey) return "#";
  const params = new URLSearchParams({ intent: task.prompt });
  return `/launch/${task.agentKey}?${params.toString()}`;
}

export function TaskCard({ task, index }: { task: Task; index: number }) {
  const live = task.status === "live";
  const href = buildLaunchUrl(task);

  return (
    <article
      className="task-card relative bg-bg-card border-2 border-rule p-7 fade-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="task-card-shadow" />

      {/* header strip */}
      <div className="flex items-center justify-between mb-6">
        <span className="font-mono text-xs uppercase tracking-widest text-ink-soft">
          {task.serial} · {task.category}
        </span>
        <StatusPill live={live} />
      </div>

      {/* big chinese title */}
      <h3 className="font-display text-3xl md:text-[2rem] leading-tight font-medium tracking-tight">
        {task.zh}
      </h3>

      <p className="mt-2 font-body italic text-ink-soft text-sm">
        {task.en}
      </p>

      <div className="rule-hair mt-6 pt-4 space-y-3">
        <Row label="一句话指令" value={task.prompt} />
        <Row label="它会交付" value={task.deliverable} />
        <Row label="耗时估计" value={task.est} mono />
      </div>

      <div className="mt-6 flex items-center justify-between">
        {live ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-ink text-bg px-4 py-2 font-mono text-xs uppercase tracking-wider hover:bg-signal transition-colors"
          >
            Run now
            <span aria-hidden>↗</span>
          </a>
        ) : (
          <span className="font-mono text-xs uppercase tracking-wider text-ink-soft">
            即将上线
          </span>
        )}

        {task.skillKey && (
          <span className="font-mono text-[0.7rem] tracking-wider text-ink-soft">
            SKILL · {task.skillKey}
          </span>
        )}
      </div>
    </article>
  );
}

function StatusPill({ live }: { live: boolean }) {
  return (
    <span
      className={
        "font-mono text-[0.65rem] uppercase tracking-[0.2em] px-2 py-1 border " +
        (live
          ? "text-signal border-signal"
          : "text-ink-soft border-rule-soft")
      }
    >
      {live ? "● live" : "soon"}
    </span>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-[0.65rem] uppercase tracking-widest text-ink-soft">
        {label}
      </span>
      <span className={mono ? "font-mono text-xs" : "font-body text-[0.95rem] text-ink"}>
        {value}
      </span>
    </div>
  );
}
