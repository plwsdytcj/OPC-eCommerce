export type TaskStatus = "live" | "soon";

export interface Task {
  id: string;
  serial: string;
  category: string;
  zh: string;
  en: string;
  prompt: string;
  deliverable: string;
  est: string;
  skillKey: string | null;
  /** opc.cross-border-agents 里对应的 agentKey；null = 暂未上线 */
  agentKey: string | null;
  status: TaskStatus;
}

export const tasks: Task[] = [
  {
    id: "amazon-listing-optimization",
    serial: "EM-001",
    category: "Listing",
    zh: "把这款产品上架到美亚",
    en: "Build a US-Amazon listing from a product description",
    prompt:
      "我有一款宠物饮水机，2L 容量，自动循环过滤。帮我做一份 US 亚马逊的 listing：title、5 行 bullets、A+ 大纲、关键词矩阵。",
    deliverable: "Listing 包：标题 / 5 bullets / 描述 / A+ 大纲 / Search Terms",
    est: "约 25 分钟",
    skillKey: "amazon-listing-optimization",
    agentKey: "listing-pro",
    status: "live",
  },
  {
    id: "amazon-niche-finder",
    serial: "EM-002",
    category: "Sourcing",
    zh: "本周给我推 5 个 niche",
    en: "Find profitable niches with low competition",
    prompt:
      "用 Helium10 + Jungle Scout 思路，给我筛 5 个月销 $30k+ 但前 5 名都 < 200 评论的 niche，避开品牌站类目。",
    deliverable: "5 个 niche · 竞争度 / 利润率 / 难度 / 进入策略",
    est: "约 18 分钟",
    skillKey: "amazon-niche-finder",
    agentKey: "niche-finder",
    status: "live",
  },
  {
    id: "amazon-keyword-research",
    serial: "EM-003",
    category: "Keyword",
    zh: "三层关键词 + Rufus 优化",
    en: "Tier 1-3 keywords + COSMO/Rufus optimization",
    prompt:
      "我的产品是「冰丝凉感床单 双人」。给我做三层关键词矩阵：核心 / 长尾 / 问询型，并标 Rufus 友好句式。",
    deliverable: "关键词矩阵 + 索引位 + Search Terms 230 字符方案",
    est: "约 12 分钟",
    skillKey: "amazon-keyword-research",
    agentKey: "keyword",
    status: "live",
  },
  {
    id: "ecom-cfo",
    serial: "FN-004",
    category: "Finance",
    zh: "上月利润和 CCC 算清楚",
    en: "Monthly P&L + cash conversion cycle",
    prompt:
      "我的店上月销售额 $42k，FBA 库存 $90k，回款周期 14 天。帮我算 contribution margin / 真实 ad efficiency / CCC，并指出哪一项最该优化。",
    deliverable: "P&L · 单位经济 · CCC 拆解 · 估值参考 · 3 个动手建议",
    est: "约 8 分钟",
    skillKey: "ecom-cfo",
    agentKey: "cfo",
    status: "live",
  },
  {
    id: "cross-border-ecommerce",
    serial: "EX-005",
    category: "Expansion",
    zh: "我的产品该不该进德国？",
    en: "Score a target market on 8 dimensions",
    prompt:
      "我的爆款是消费电子配件，现在 80% 美国销售。帮我评估德国 / 日本 / 巴西三个市场的优先级：政策合规、税、支付、物流、获客成本。",
    deliverable: "8 维度打分 · 5 种履约模型对比 · 分阶段进入路线图",
    est: "约 30 分钟",
    skillKey: "cross-border-ecommerce",
    agentKey: "expansion",
    status: "live",
  },
  {
    id: "fba-inventory-watch",
    serial: "OP-006",
    category: "Operations",
    zh: "FBA 库存预警 · 谁该补",
    en: "FBA inventory health watch",
    prompt:
      "扫一遍我所有 SKU 的 FBA 库存周转，按补货优先级排序，标出 30 天内会断货的、120 天还卖不完的、被仓储费蚕食的。",
    deliverable: "SKU 健康表 · 补货优先级 · 长库存清仓建议",
    est: "约 5 分钟",
    skillKey: null,
    agentKey: "fba",
    status: "soon",
  },
];
