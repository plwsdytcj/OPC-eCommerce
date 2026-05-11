import { TaskCard } from "./TaskCard";
import { tasks } from "@/data/tasks";

export function TaskGrid() {
  return (
    <section id="tasks" className="rule-thick bg-bg">
      <div className="page-container py-20 md:py-28">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <div className="serial mb-3">第 002 章 · 在岗员工</div>
            <h2 className="font-display text-5xl md:text-6xl font-medium tracking-tight">
              选一个任务，<br />
              <span className="italic">现在就让它跑。</span>
            </h2>
          </div>
          <p className="md:max-w-xs font-body text-base text-ink-soft md:text-right">
            每张卡 = 一位在岗 AI 员工 · 真实 SKILL.md 灵魂 · 点 <span className="font-mono">Run now</span> 直达工作台。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
          {tasks.map((t, i) => (
            <TaskCard key={t.id} task={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
