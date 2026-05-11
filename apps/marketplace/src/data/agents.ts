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
  /**
   * 已经真跑过一次的样品 issue id（paperclip 那边）。
   * 如果有，卡片上会出现「看一份真实成品 ↗」按钮，链到 /OPC/issues/<id>。
   */
  sampleIssueId?: string;
  /** 样品产出的一句话归纳，hover 时显示 */
  sampleSummary?: string;
}

/** paperclip 工作台 URL（dev 本地 / 公网都从同一个常量取） */
export const WORKBENCH_BASE =
  process.env.NEXT_PUBLIC_PAPERCLIP_BASE ?? "http://127.0.0.1:3101";

/** 公司 issuePrefix — 暂硬编码到 OPC Pilot Co */
export const COMPANY_PREFIX = "OPC";

/**
 * 协作链：跑完这个 agent 后，paperclip 里的 dispatcher 会自动派活给下游 agent。
 * 必须和 packages/plugin-cross-border-agents/src/agent-roster.ts 的 DOWNSTREAM_MAP 保持一致。
 * 这里是给 marketplace 卡片显示用的。
 */
export const DOWNSTREAM_MAP: Record<string, readonly string[]> = {
  "listing-pro": ["keyword", "cfo"],
  "niche-finder": ["keyword", "cfo"],
  "expansion": ["compliance"],
  "adcopy": ["cfo"],
  "fba": ["cfo"],
  "keyword": [],
  "cfo": [],
  "compliance": [],
};

/** agent key → 卡片上要显示的名字（简短版） */
export const AGENT_SHORT_NAME: Record<string, string> = {
  "listing-pro": "listing",
  "niche-finder": "niche",
  "keyword": "keyword",
  "cfo": "cfo",
  "expansion": "expansion",
  "fba": "fba",
  "compliance": "compliance",
  "adcopy": "adcopy",
};

/**
 * 已经跑过一次的协作链真实样例（dispatcher 自动 spawn 出来的）。
 * marketplace 首页 hero 会用它做"小队接力"的实证链接。
 */
export const SAMPLE_CHAIN = {
  upstream: { agentKey: "listing-pro", issueId: "64b23a08-8630-4a28-96dd-01662f6e68d0", identifier: "OPC-14" },
  downstreams: [
    { agentKey: "keyword", issueId: "0e2f13d8-180e-4417-9f05-f55436c03819", identifier: "OPC-15" },
    { agentKey: "cfo", issueId: "eddcf604-c832-4dbb-89d6-70901492f6ec", identifier: "OPC-16" },
  ],
};

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
    sampleIssueId: "0e9ff365-8ec0-4029-85d0-6f419dd0b1d5",
    sampleSummary:
      "PetSpring W-2L Pro 美亚 listing：标题 183/200 + 5 bullets + A+ 6 模块 + Search Terms 211/230，14/14 关键词全覆盖",
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
    sampleIssueId: "89e5d70d-c5ce-4879-9b92-f38a1a5c3536",
    sampleSummary:
      "宠物/户外/家居整理 5 个 niche，附 8 维度评分表 + Top 3 推荐 + 1688 FOB 比 + 7 天动作清单",
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
    sampleIssueId: "1ea2e06a-d7ef-4593-a963-87830757f034",
    sampleSummary:
      "便携蓝牙音箱 Tier 1/2/3 三层关键词矩阵 + Rufus 问句 + Search Terms + 关键词覆盖映射",
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
    sampleIssueId: "0e9b4d54-33c8-4301-b4c9-e68b6678ff94",
    sampleSummary:
      "$42k/月 跨境一人公司三月 P&L：贡献利润 -$252/月，真实 CCC 62.6 天，给出 3 个动手建议",
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
    sampleIssueId: "355d435a-8f15-493a-a430-c4cf562502ea",
    sampleSummary:
      "US 站 $42k 现金 $80k → 第二站推荐：DE/UK/CA 8 维度打分 + 5 履约模型 + 30/90/180 天路线图",
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
    status: "live",
    sampleIssueId: "a3381cc6-49b2-4867-a19b-e481776e9a5b",
    sampleSummary:
      "12 个 SKU 库存扫描：4 个 30 天断货预警 + 4 个 120 天积压；附补货 + 清库执行清单",
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
    status: "live",
    sampleIssueId: "125a0f1c-f73d-4cc8-ab70-cd8355cbe9f6",
    sampleSummary:
      "DE/JP/CA/UK 四市场合规预审：食品接触/电气/锂电/VAT/EORI 全覆盖；难度排序 CA→JP→UK→DE",
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
    status: "live",
    sampleIssueId: "a6d3265b-2c41-44b8-9578-1f0bd03f11b0",
    sampleSummary:
      "Amazon SB/SD + TikTok/Meta/Google Shopping 五平台文案矩阵，含 A/B 测试组合表 + TOS 禁词规避",
  },
];
