import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StoreBrowser } from "@/components/StoreBrowser";

export const metadata = {
  title: "Agent Store · OPC",
  description:
    "OPC 跨境 AI 员工目录。Listing、选品、关键词、财务、出海、运营、合规、营销 8 大职能。",
};

export default function StorePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="rule-thin">
          <div className="page-container py-12 md:py-16">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-2">
              <div>
                <div className="serial mb-3">第 002 章 · Agent Store</div>
                <h1 className="font-display text-5xl md:text-7xl font-medium tracking-tight leading-[0.95]">
                  在岗员工 <br />
                  <span className="italic">全名单。</span>
                </h1>
              </div>
              <p className="md:max-w-sm font-body text-base text-ink-soft">
                每个 agent = 一个真实的 SKILL.md 灵魂 + 工具集。
                内测期一律免费跑，<span className="italic">商用价格上线后按表收费</span>。
              </p>
            </div>
          </div>
        </section>

        <section className="rule-thick bg-bg">
          <div className="page-container py-10 md:py-14">
            <StoreBrowser />
          </div>
        </section>

        {/* CTA back to workbench */}
        <section className="rule-thick bg-ink text-bg">
          <div className="page-container py-16 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <h2 className="font-display text-3xl md:text-5xl font-medium tracking-tight">
              先开工作台， <span className="italic">再挑员工。</span>
            </h2>
            <a
              href="http://127.0.0.1:3101"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between gap-4 bg-signal text-bg px-8 py-5 font-mono text-sm uppercase tracking-wider hover:bg-bg hover:text-ink transition-colors"
            >
              <span>打开工作台 (127.0.0.1:3101)</span>
              <span aria-hidden className="text-2xl">→</span>
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
