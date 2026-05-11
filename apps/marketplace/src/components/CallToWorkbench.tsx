export function CallToWorkbench() {
  return (
    <section className="rule-thick bg-ink text-bg">
      <div className="page-container py-24 md:py-32 grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-7">
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-bg/60 mb-6">
            / 内测开放 · 跨境园区合作中 /
          </div>
          <h2 className="font-display text-5xl md:text-7xl font-medium tracking-tight leading-[0.95]">
            不需要付费。<br />
            <span className="italic">需要你今晚 8 点</span><br />
            把第一项任务交给它。
          </h2>
        </div>

        <div className="col-span-12 md:col-span-5 md:pl-8 flex flex-col justify-end gap-4">
          <a
            href="http://127.0.0.1:3101"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-between gap-4 bg-signal text-bg px-8 py-6 font-mono text-sm uppercase tracking-wider hover:bg-bg hover:text-ink transition-colors"
          >
            <span>打开本地工作台</span>
            <span aria-hidden className="text-2xl">→</span>
          </a>
          <a
            href="#tasks"
            className="inline-flex items-center justify-between gap-4 border border-bg/40 text-bg px-8 py-6 font-mono text-sm uppercase tracking-wider hover:border-bg hover:bg-bg/10 transition-colors"
          >
            <span>先看看 6 张员工卡</span>
            <span aria-hidden className="text-2xl">↑</span>
          </a>
          <p className="font-body text-sm text-bg/50 mt-4">
            工作台地址：<span className="font-mono">http://127.0.0.1:3101</span>
            <br />
            （需先在本机起 paperclip）
          </p>
        </div>
      </div>
    </section>
  );
}
