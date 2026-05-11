export type AgentCategory =
  | "Listing"
  | "Sourcing"
  | "Keyword"
  | "Finance"
  | "Expansion"
  | "Operations"
  | "Compliance"
  | "Marketing";

export interface AgentShowcase {
  /** 短标题（4-8 字），叠在缩略图上 */
  label: string;
  /** 缩略图的视觉主色，决定渐变 */
  hue: string;
  /** 强调色，描边/小点 */
  ink?: string;
}

export interface Agent {
  id: string;
  /** 对应 paperclip opc.cross-border-agents 插件里的 agentKey；null = 还没上线 */
  agentKey: string | null;
  handle: string;          // "@listing-pro"
  name: string;            // "Listing 优化员"
  tagline: string;         // 一句话职位描述
  category: AgentCategory;
  badge: "OPC" | "Pro" | "Beta";
  skillKey: string | null;
  /** 4-6 张交付物缩略图（用渐变 placeholder，等以后接真截图） */
  showcase: AgentShowcase[];
  /** 价格区间（人民币 / run），内测期都标 0 */
  price: { low: number; high: number; unit?: string };
  /** 估算耗时 */
  est: string;
  status: "live" | "soon";
}

export const CATEGORIES: { key: "All" | AgentCategory; zh: string }[] = [
  { key: "All", zh: "全部" },
  { key: "Listing", zh: "Listing" },
  { key: "Sourcing", zh: "选品" },
  { key: "Keyword", zh: "关键词" },
  { key: "Finance", zh: "财务" },
  { key: "Expansion", zh: "出海" },
  { key: "Operations", zh: "运营" },
  { key: "Compliance", zh: "合规" },
  { key: "Marketing", zh: "营销" },
];

export const agents: Agent[] = [
  {
    id: "listing-pro",
    agentKey: "listing-pro",
    handle: "@listing-pro",
    name: "Listing 优化员",
    tagline: "把产品上架到美 / 欧 / 日亚马逊，标题 + 5 bullets + A+ + Search Terms。",
    category: "Listing",
    badge: "OPC",
    skillKey: "amazon-listing-optimization",
    showcase: [
      { label: "Title v3", hue: "#D04A2E" },
      { label: "Bullets", hue: "#1B3A4B" },
      { label: "A+ 大纲", hue: "#BC8F2A" },
      { label: "Search T", hue: "#0E0E0C" },
      { label: "Backend", hue: "#5C6B6E" },
    ],
    price: { low: 3, high: 8 },
    est: "约 25 分钟",
    status: "live",
  },
  {
    id: "niche-finder",
    agentKey: "niche-finder",
    handle: "@niche-finder",
    name: "选品调研员",
    tagline: "每周扫一遍 Amazon 月销 $30k+ 且评论 <200 的机会 niche。",
    category: "Sourcing",
    badge: "OPC",
    skillKey: "amazon-niche-finder",
    showcase: [
      { label: "Niche #1", hue: "#1B3A4B" },
      { label: "Niche #2", hue: "#1B3A4B" },
      { label: "评分表", hue: "#BC8F2A" },
      { label: "策略", hue: "#D04A2E" },
    ],
    price: { low: 5, high: 12 },
    est: "约 18 分钟",
    status: "live",
  },
  {
    id: "keyword-strategist",
    agentKey: "keyword",
    handle: "@keyword",
    name: "关键词策略员",
    tagline: "三层关键词 + COSMO / Rufus 优化 + Search Terms 230 字符合规。",
    category: "Keyword",
    badge: "OPC",
    skillKey: "amazon-keyword-research",
    showcase: [
      { label: "Tier 1", hue: "#D04A2E" },
      { label: "Tier 2", hue: "#BC8F2A" },
      { label: "Tier 3", hue: "#1B3A4B" },
      { label: "Rufus Q", hue: "#0E0E0C" },
    ],
    price: { low: 1, high: 3 },
    est: "约 12 分钟",
    status: "live",
  },
  {
    id: "ecom-cfo",
    agentKey: "cfo",
    handle: "@cfo",
    name: "Ecom CFO",
    tagline: "月度 P&L · 单位经济 · 现金转换周期 · 真实广告效率 · 估值参考。",
    category: "Finance",
    badge: "OPC",
    skillKey: "ecom-cfo",
    showcase: [
      { label: "P&L", hue: "#1B3A4B" },
      { label: "Unit Econ", hue: "#BC8F2A" },
      { label: "CCC", hue: "#D04A2E" },
      { label: "Valuation", hue: "#0E0E0C" },
      { label: "建议", hue: "#5C6B6E" },
    ],
    price: { low: 8, high: 15 },
    est: "约 8 分钟",
    status: "live",
  },
  {
    id: "expansion-strategist",
    agentKey: "expansion",
    handle: "@expansion",
    name: "出海评估员",
    tagline: "8 维度市场打分 · 5 种履约模型 · 国别税务 / 支付 / 物流路线图。",
    category: "Expansion",
    badge: "OPC",
    skillKey: "cross-border-ecommerce",
    showcase: [
      { label: "DE 评分", hue: "#1B3A4B" },
      { label: "JP 评分", hue: "#D04A2E" },
      { label: "BR 评分", hue: "#BC8F2A" },
      { label: "履约表", hue: "#0E0E0C" },
      { label: "路线图", hue: "#5C6B6E" },
    ],
    price: { low: 12, high: 25 },
    est: "约 30 分钟",
    status: "live",
  },
  {
    id: "fba-watcher",
    agentKey: "fba",
    handle: "@fba",
    name: "FBA 库存员",
    tagline: "扫所有 SKU 周转 · 标 30 天断货 · 标 120 天积压 · 算仓储费蚕食。",
    category: "Operations",
    badge: "Beta",
    skillKey: null,
    showcase: [
      { label: "SKU 表", hue: "#5C6B6E" },
      { label: "断货预警", hue: "#D04A2E" },
      { label: "积压清单", hue: "#BC8F2A" },
      { label: "补货排程", hue: "#1B3A4B" },
    ],
    price: { low: 0, high: 0 },
    est: "约 5 分钟",
    status: "soon",
  },
  {
    id: "compliance-checker",
    agentKey: "compliance",
    handle: "@compliance",
    name: "跨境合规员",
    tagline: "FDA · CE · CCC · EORI · VAT 申报材料预审，附下载清单。",
    category: "Compliance",
    badge: "Beta",
    skillKey: null,
    showcase: [
      { label: "美 FDA", hue: "#1B3A4B" },
      { label: "欧 CE", hue: "#D04A2E" },
      { label: "日 PSE", hue: "#BC8F2A" },
      { label: "出口单", hue: "#0E0E0C" },
    ],
    price: { low: 0, high: 0 },
    est: "约 15 分钟",
    status: "soon",
  },
  {
    id: "ad-copywriter",
    agentKey: "adcopy",
    handle: "@adcopy",
    name: "Ads 文案员",
    tagline: "Sponsored Brand / Display / TikTok / Meta 多端文案 + A/B 变体。",
    category: "Marketing",
    badge: "Beta",
    skillKey: null,
    showcase: [
      { label: "SB 文案", hue: "#D04A2E" },
      { label: "TikTok", hue: "#1B3A4B" },
      { label: "Meta", hue: "#BC8F2A" },
      { label: "A/B 表", hue: "#0E0E0C" },
    ],
    price: { low: 0, high: 0 },
    est: "约 10 分钟",
    status: "soon",
  },
];
