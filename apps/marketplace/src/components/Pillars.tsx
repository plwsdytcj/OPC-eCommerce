const pillars = [
  {
    n: "I.",
    h: "24×7 不下班",
    p: "员工跑在 paperclip 工作台里。你下班关电脑，它接着跑：盯库存、扫排名、待数据更新自动出报告。次日早八点你打开邮箱，结果在那等你。",
  },
  {
    n: "II.",
    h: "越用越懂你的店",
    p: "员工有持久记忆。你告诉它一次「我的目标毛利 35%」，它在每次出 Listing / 跟单 / 算账时都按这条线推。它不是每次重新入职。",
  },
  {
    n: "III.",
    h: "高风险动作必须你点头",
    p: "上架、扣款、发邮件给客户、跨境申报——这些动作员工不会自己做，它把方案放你面前等确认。审计日志一条不漏，可追溯到每个 token。",
  },
];

export function Pillars() {
  return (
    <section id="how" className="rule-thick bg-bg-card">
      <div className="page-container py-24">
        <div className="flex items-baseline gap-4 mb-14">
          <span className="serial">第 003 章 · 不是聊天机器人</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {pillars.map((p, i) => (
            <div
              key={p.n}
              className="fade-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="font-display text-7xl text-signal italic mb-4 leading-none">
                {p.n}
              </div>
              <h3 className="font-display text-3xl font-medium tracking-tight mb-3">
                {p.h}
              </h3>
              <p className="font-body text-base text-ink-soft leading-relaxed">
                {p.p}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
