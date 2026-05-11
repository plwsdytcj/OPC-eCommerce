export function Header() {
  return (
    <header className="rule-thick">
      <div className="page-container flex items-center justify-between py-4">
        <a href="/" className="flex items-baseline gap-3">
          <span className="font-display text-2xl font-bold tracking-tight">OPC</span>
          <span className="serial hidden md:inline">v0.2 · 2026 Q2</span>
        </a>

        <nav className="flex items-center gap-6 text-sm">
          <a className="hidden md:inline hover:text-signal" href="/store">
            Agent Store
          </a>
          <a className="hidden md:inline hover:text-signal" href="/#how">
            为什么
          </a>
          <a className="hidden md:inline hover:text-signal" href="/#faq">
            FAQ
          </a>
          <a
            href="http://127.0.0.1:3101"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs uppercase tracking-wider border border-rule px-3 py-2 hover:bg-ink hover:text-bg transition-colors"
          >
            打开工作台 →
          </a>
        </nav>
      </div>
    </header>
  );
}
