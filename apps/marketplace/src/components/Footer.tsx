export function Footer() {
  return (
    <footer className="bg-bg rule-thick">
      <div className="page-container py-12 grid grid-cols-12 gap-6 text-sm">
        <div className="col-span-12 md:col-span-4">
          <div className="font-display text-3xl font-bold tracking-tight">OPC</div>
          <p className="font-body text-ink-soft mt-3 max-w-xs leading-relaxed">
            跨境一人公司的 AI 员工平台。
            <br />
            为 OPC 园区运营商和终端客户共同设计。
          </p>
        </div>

        <div className="col-span-6 md:col-span-3">
          <div className="serial mb-3">产品</div>
          <ul className="space-y-2 font-body">
            <li><a href="/store" className="hover:text-signal">Agent Store</a></li>
            <li><a href="/#how" className="hover:text-signal">工作机制</a></li>
            <li><a href="/#faq" className="hover:text-signal">常见疑问</a></li>
            <li><a href="http://127.0.0.1:3101" target="_blank" rel="noopener noreferrer" className="hover:text-signal">工作台</a></li>
          </ul>
        </div>

        <div className="col-span-6 md:col-span-3">
          <div className="serial mb-3">技术</div>
          <ul className="space-y-2 font-body">
            <li>底座：paperclip</li>
            <li>插件 SDK · managedSkills</li>
            <li>5 个 SKILL.md (MIT)</li>
            <li>本地内嵌 Postgres</li>
          </ul>
        </div>

        <div className="col-span-12 md:col-span-2 md:text-right">
          <div className="serial mb-3">合作</div>
          <ul className="space-y-2 font-body">
            <li>园区招商</li>
            <li>员工开发者</li>
            <li>跨境技能贡献</li>
          </ul>
        </div>
      </div>

      <div className="rule-hair">
        <div className="page-container py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 font-mono text-xs uppercase tracking-widest text-ink-soft">
          <span>© 2026 OPC · v0.2 · pre-release</span>
          <span>Built on paperclipai/paperclip · MIT</span>
        </div>
      </div>
    </footer>
  );
}
