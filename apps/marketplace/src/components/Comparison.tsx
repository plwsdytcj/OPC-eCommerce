import { compareRows } from "@/data/comparison";

export function Comparison() {
  return (
    <section className="rule-thick bg-bg">
      <div className="page-container py-24">
        <div className="mb-12">
          <div className="serial mb-3">第 004 章 · 取舍表</div>
          <h2 className="font-display text-5xl md:text-6xl font-medium tracking-tight max-w-3xl">
            自己雇人 / ChatGPT / OPC AI 公司 — <br />
            <span className="italic">三条路并排放着。</span>
          </h2>
        </div>

        <div className="overflow-x-auto rule-thin pt-6">
          <table className="w-full text-left border-collapse font-body">
            <thead>
              <tr className="border-b-2 border-rule">
                <th className="py-4 pr-4 font-mono text-xs uppercase tracking-widest text-ink-soft w-1/4">
                  维度
                </th>
                <th className="py-4 px-4 font-mono text-xs uppercase tracking-widest text-ink-soft">
                  自己雇人
                </th>
                <th className="py-4 px-4 font-mono text-xs uppercase tracking-widest text-ink-soft">
                  ChatGPT / Copilot
                </th>
                <th className="py-4 px-4 font-mono text-xs uppercase tracking-widest text-signal">
                  OPC AI 公司
                </th>
              </tr>
            </thead>
            <tbody>
              {compareRows.map((row, i) => (
                <tr
                  key={row.dimension}
                  className={
                    "border-b border-rule-soft " +
                    (i % 2 === 1 ? "bg-bg-card/40" : "")
                  }
                >
                  <td className="py-5 pr-4 font-display font-medium text-lg">
                    {row.dimension}
                  </td>
                  <td className="py-5 px-4 text-ink-soft">{row.manual}</td>
                  <td className="py-5 px-4 text-ink-soft">{row.chatgpt}</td>
                  <td
                    className={
                      "py-5 px-4 " +
                      (row.opcHighlight
                        ? "font-display text-lg font-medium text-signal"
                        : "")
                    }
                  >
                    {row.opc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
