import { faqs } from "@/data/faq";

export function FAQ() {
  return (
    <section id="faq" className="rule-thick bg-bg-card">
      <div className="page-container py-24">
        <div className="mb-14">
          <div className="serial mb-3">第 005 章 · 常见疑问</div>
          <h2 className="font-display text-5xl md:text-6xl font-medium tracking-tight">
            提前回答
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {faqs.map((item, i) => (
            <details
              key={i}
              className="md:col-span-6 group rule-thin pt-5 fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <summary className="cursor-pointer list-none flex items-baseline gap-3">
                <span className="font-mono text-xs text-ink-soft tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-xl md:text-2xl font-medium tracking-tight flex-1">
                  {item.q}
                </span>
                <span className="font-mono text-2xl text-signal transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 ml-7 font-body text-base text-ink-soft leading-relaxed pb-4">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
