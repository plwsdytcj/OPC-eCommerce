export function Hero() {
  return (
    <section className="rule-thin relative overflow-hidden">
      <div className="page-container py-16 md:py-28 grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-7 fade-up">
          <div className="serial mb-6">第 001 号 · 跨境 OPC 园区 · 内测</div>

          <h1 className="font-display text-[clamp(2.75rem,7vw,6rem)] leading-[0.95] font-medium tracking-tight">
            <span className="block">你的跨境</span>
            <span className="block italic" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 80, "WONK" 1' }}>
              一人公司
            </span>
            <span className="block">
              从今晚 <span className="text-signal">8 点</span> 开始替你跑
            </span>
          </h1>

          <p className="mt-8 max-w-xl font-body text-lg md:text-xl leading-snug text-ink-soft">
            8 个 AI 员工，会写 Listing、会做选品、会算账、会盯库存。<br />
            而且 —— <span className="italic">它们会自动彼此接力</span>：
            <br />
            上游交付完，下游自动开干。
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#chain"
              className="inline-flex items-center gap-3 bg-ink text-bg px-6 py-4 font-mono text-sm uppercase tracking-wider hover:bg-signal transition-colors"
            >
              看一次真实的小队接力
              <span aria-hidden>↓</span>
            </a>
            <a
              href="#tasks"
              className="inline-flex items-center gap-2 font-mono text-sm uppercase tracking-wider underline underline-offset-4 decoration-2 hover:text-signal"
            >
              直接挑一个 agent 跑
            </a>
          </div>
        </div>

        {/* right: ASCII / numerical readout — like a cargo manifest */}
        <aside className="col-span-12 md:col-span-5 fade-up" style={{ animationDelay: "120ms" }}>
          <div className="rule-thin pt-6 mt-2 md:mt-12">
            <div className="serial mb-4">/ live status — local instance /</div>
            <dl className="font-mono text-sm space-y-3">
              <ManifestRow label="instance" value="paperclip-master" />
              <ManifestRow label="port" value="127.0.0.1:3101" />
              <ManifestRow label="employees" value="8 / 8" />
              <ManifestRow label="dispatch chains" value="5 active" emphasis />
              <ManifestRow label="auto-retry on fail" value="on" />
              <ManifestRow label="uptime" value="∞" />
            </dl>
          </div>

          <div className="mt-8 rule-thin pt-6">
            <div className="serial mb-3">/ what they do, in one line /</div>
            <ul className="font-body text-base space-y-1.5">
              <li>— Listing 员 给你写美亚标题 + bullets</li>
              <li>— 选品员 周扫一遍机会 niche</li>
              <li>— 关键词员 摸清 Rufus 怎么想</li>
              <li>— CFO 帮你算上月真利润</li>
              <li>— 出海评估员 比对德 / 日 / 澳市场</li>
            </ul>
          </div>
        </aside>
      </div>

      {/* ticker */}
      <div className="rule-thin">
        <div className="overflow-hidden whitespace-nowrap py-3">
          <div className="ticker-track inline-block">
            {Array.from({ length: 2 }).map((_, i) => (
              <span key={i} className="font-mono text-xs uppercase tracking-[0.2em] text-ink-soft">
                ★ AMAZON&nbsp;US&nbsp;&nbsp;·&nbsp;&nbsp;DE&nbsp;&nbsp;·&nbsp;&nbsp;JP&nbsp;&nbsp;·&nbsp;&nbsp;UK&nbsp;&nbsp;·&nbsp;&nbsp;
                SHOPIFY&nbsp;&nbsp;·&nbsp;&nbsp;TIKTOK&nbsp;SHOP&nbsp;&nbsp;·&nbsp;&nbsp;TEMU&nbsp;&nbsp;·&nbsp;&nbsp;
                独立站&nbsp;&nbsp;·&nbsp;&nbsp;FBA&nbsp;&nbsp;·&nbsp;&nbsp;CFR&nbsp;&nbsp;·&nbsp;&nbsp;DDP&nbsp;&nbsp;·&nbsp;&nbsp;
                LCL&nbsp;&nbsp;·&nbsp;&nbsp;USPTO&nbsp;&nbsp;·&nbsp;&nbsp;EORI&nbsp;&nbsp;·&nbsp;&nbsp;VAT&nbsp;&nbsp;·&nbsp;&nbsp;
                IRP&nbsp;&nbsp;·&nbsp;&nbsp;ESG&nbsp;&nbsp;·&nbsp;&nbsp;★&nbsp;&nbsp;&nbsp;&nbsp;
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ManifestRow({ label, value, emphasis }: { label: string; value: string; emphasis?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 rule-hair pt-2">
      <dt className="text-ink-soft uppercase tracking-wider text-[0.7rem]">{label}</dt>
      <dd
        className={
          emphasis
            ? "text-signal text-base font-bold tabular-nums"
            : "tabular-nums"
        }
      >
        {value}
      </dd>
    </div>
  );
}
