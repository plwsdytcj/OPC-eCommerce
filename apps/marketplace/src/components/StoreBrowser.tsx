"use client";

import { useMemo, useState } from "react";
import { AgentCard } from "./AgentCard";
import { agents, CATEGORIES, type Agent, type AgentCategory } from "@/data/agents";

type Filter = "All" | AgentCategory;
type View = "relaxed" | "compact";

export function StoreBrowser() {
  const [filter, setFilter] = useState<Filter>("All");
  const [view, setView] = useState<View>("relaxed");

  const visible: Agent[] = useMemo(() => {
    if (filter === "All") return agents;
    return agents.filter((a) => a.category === filter);
  }, [filter]);

  const counts = useMemo(() => {
    const map = new Map<Filter, number>();
    map.set("All", agents.length);
    for (const a of agents) {
      map.set(a.category, (map.get(a.category) ?? 0) + 1);
    }
    return map;
  }, []);

  return (
    <div>
      {/* control bar */}
      <div className="rule-thin pt-5 mt-2 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* category tabs */}
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => {
            const active = filter === c.key;
            const n = counts.get(c.key) ?? 0;
            if (n === 0 && c.key !== "All") return null;
            return (
              <button
                key={c.key}
                onClick={() => setFilter(c.key)}
                className={
                  "font-mono text-xs uppercase tracking-wider px-3 py-2 border transition-colors " +
                  (active
                    ? "bg-ink text-bg border-ink"
                    : "border-rule-soft text-ink-soft hover:border-rule hover:text-ink")
                }
              >
                {c.zh}{" "}
                <span className="tabular-nums text-[0.65rem] opacity-70">
                  {n.toString().padStart(2, "0")}
                </span>
              </button>
            );
          })}
        </div>

        {/* view switch */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-[0.65rem] uppercase tracking-widest text-ink-soft">
            view
          </span>
          {(["relaxed", "compact"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={
                "font-mono text-xs uppercase tracking-wider px-3 py-1.5 border transition-colors " +
                (view === v
                  ? "border-rule bg-ink text-bg"
                  : "border-rule-soft text-ink-soft hover:border-rule hover:text-ink")
              }
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* count */}
      <div className="font-mono text-xs text-ink-soft mb-5">
        {visible.length.toString().padStart(2, "0")} agent{visible.length !== 1 ? "s" : ""}
        {filter !== "All" && (
          <span>
            {" "}
            · 分类 <span className="text-ink">{filter}</span>
          </span>
        )}
      </div>

      {/* grid */}
      <div
        className={
          "grid gap-5 " +
          (view === "compact"
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5"
            : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3")
        }
      >
        {visible.map((a, i) => (
          <AgentCard key={a.id} agent={a} index={i} />
        ))}
      </div>

      {/* empty state */}
      {visible.length === 0 && (
        <div className="font-body text-ink-soft py-20 text-center">
          这个分类还没员工。换个看看？
        </div>
      )}
    </div>
  );
}
