import type { PluginManagedAgentDeclaration } from "@paperclipai/plugin-sdk";

// SKILL.md 通过 esbuild text loader 在构建时内嵌为字符串
// 这样每个 agent 的 instructions 直接带上自己的核心 SOP，不依赖 codex/claude
// 在 cwd 里 cat 文件（plugin 装的 skill 只在 paperclip 数据库里，没落盘）
// @ts-ignore
import listingMd from "../../db/seeds/skills/listing/amazon-listing-optimization.md";
// @ts-ignore
import sourcingMd from "../../db/seeds/skills/sourcing/amazon-niche-finder.md";
// @ts-ignore
import keywordMd from "../../db/seeds/skills/keyword/amazon-keyword-research.md";
// @ts-ignore
import financeMd from "../../db/seeds/skills/finance/ecom-cfo.md";
// @ts-ignore
import expansionMd from "../../db/seeds/skills/expansion/cross-border-ecommerce.md";

const SKILL_TEXT: Record<string, string> = {
  "amazon-listing-optimization": listingMd as unknown as string,
  "amazon-niche-finder": sourcingMd as unknown as string,
  "amazon-keyword-research": keywordMd as unknown as string,
  "ecom-cfo": financeMd as unknown as string,
  "cross-border-ecommerce": expansionMd as unknown as string,
};

/**
 * OPC 跨境 AI 员工花名册
 *
 * 每个 agent 的 instructions 由 buildInstructions 组装：
 *   - 角色定义 + 工作守则 + 输出格式
 *   - 把 spec.skillSlug 对应的 SKILL.md 全文 inline 进 prompt
 *
 * agentKey 与 marketplace store 的 agent.id 一一对应，
 * marketplace [Run Now] 跳转时通过 agentKey 路由到对应 agent。
 */

interface AgentSpec {
  key: string;
  name: string;
  title: string;
  role: string;
  icon: string;
  capabilities: string;
  skillSlug: string;
  status: "idle" | "paused";
}

/**
 * 数字员工协作链：每个 agent 完成主任务后，dispatcher 自动 spawn 子 issue
 * 派给下面这些 agent，让它们接力工作。
 *
 * 设计规则：
 * - 只对顶层 issue（无 parentId）派活，避免循环
 * - 中游/汇总型 agent（keyword/cfo/compliance）下游为空，作为协作链终点
 * - 上游 agent 把"该交给下游的输入"在 dispatcher 里写成具体 prompt
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

/**
 * 上游 agent 完成后，给下游 agent 的 task prompt 模板。
 * 第一个参数是上游 issue 的 short link（OPC-N），第二个是上游 agent key。
 */
export function buildDispatchPrompt(
  upstreamKey: string,
  downstreamKey: string,
  upstreamIssueIdentifier: string,
  upstreamTitle: string,
): { title: string; description: string } {
  const upstreamRef = `${upstreamIssueIdentifier} (上游 @${upstreamKey})`;
  const shortTitle =
    upstreamTitle.length > 24 ? `${upstreamTitle.slice(0, 24)}…` : upstreamTitle;
  const map: Record<string, Record<string, { title: string; description: string }>> = {
    "listing-pro": {
      keyword: {
        title: `[接力] ${upstreamIssueIdentifier} → 追加 30 天 SEM 关键词`,
        description:
          `## 协作上下文\n\n` +
          `这是 ${upstreamRef} listing 出货后的接力任务。\n\n` +
          `请打开上游 issue 看 listing 文案，基于它的产品定位输出：\n\n` +
          `1. 30 天 Amazon PPC 关键词梯队（Tier 1/2/3 + 否定词）\n` +
          `2. 配套 Google Shopping / Meta Ads 5-8 词\n` +
          `3. 每周值得追加的 3 个长尾测试词\n` +
          `4. 末尾给「下一步可执行动作」清单\n\n` +
          `如果上游 listing 缺少能让你做这一步的关键信息，请在 comment 里标 \`[需核实]\`，不要伪造。`,
      },
      cfo: {
        title: `[接力] ${upstreamIssueIdentifier} → 算单位经济`,
        description:
          `## 协作上下文\n\n` +
          `这是 ${upstreamRef} listing 出货后的接力任务。\n\n` +
          `请打开上游 issue 拿售价 / 主要成本假设，输出：\n\n` +
          `1. 单 SKU 单位经济：单价、COGS、FBA、广告、运营摊销、贡献利润\n` +
          `2. 盈亏平衡日销量\n` +
          `3. 4 个广告效率档位（TACoS 5% / 10% / 15% / 20%）下的真实净利\n` +
          `4. 3 个具体改善建议\n` +
          `5. 末尾「下一步可执行动作」清单\n\n` +
          `缺数据请标 \`[需核实]\`，不要编造。`,
      },
    },
    "niche-finder": {
      keyword: {
        title: `[接力] ${upstreamIssueIdentifier} → niche 关键词矩阵`,
        description:
          `## 协作上下文\n\n` +
          `${upstreamRef} 完成了 niche 推荐。请打开上游 issue 拿 Top 3 niche，` +
          `对每个 niche 做完整关键词矩阵（Tier 1/2/3 + 后台 Search Terms + Rufus 问句）。` +
          `末尾给「下一步可执行动作」清单。`,
      },
      cfo: {
        title: `[接力] ${upstreamIssueIdentifier} → Top 3 niche 单位经济`,
        description:
          `## 协作上下文\n\n` +
          `${upstreamRef} 选出了 Top 3 niche。请按每个 niche 的 FOB、售价、` +
          `平台费做单位经济测算，输出"上哪个 niche 最赚钱"的盈亏平衡对比。` +
          `末尾给「下一步可执行动作」清单。`,
      },
    },
    "expansion": {
      compliance: {
        title: `[接力] ${upstreamIssueIdentifier} → 推荐市场合规预审`,
        description:
          `## 协作上下文\n\n` +
          `${upstreamRef} 完成出海评估，给出了 Top 3 推荐市场。请打开上游 issue 拿目标市场，` +
          `按推荐顺序输出每个市场的合规预审清单（食品接触 / 电气 / 锂电 / 当地税务）。` +
          `末尾给「30 天可执行动作」清单。`,
      },
    },
    "adcopy": {
      cfo: {
        title: `[接力] ${upstreamIssueIdentifier} → 广告 ROAS / 预算红线`,
        description:
          `## 协作上下文\n\n` +
          `${upstreamRef} 完成多平台文案矩阵。请按 A/B 测试组合估算各平台广告 ROAS、` +
          `安全 ACoS 上限、月度广告预算红线。末尾给「下一步可执行动作」清单。`,
      },
    },
    "fba": {
      cfo: {
        title: `[接力] ${upstreamIssueIdentifier} → 仓储费蚕食 + 现金占用`,
        description:
          `## 协作上下文\n\n` +
          `${upstreamRef} 输出库存预警。请按断货 / 积压 SKU 估算 6 个月仓储费蚕食、` +
          `现金占用变化，给出"是否值得清库存"的决策建议。末尾给「下一步可执行动作」清单。`,
      },
    },
  };
  const fallback = {
    title: `[接力] ${upstreamIssueIdentifier} → ${downstreamKey}：${shortTitle}`,
    description: `${upstreamRef} 完成，请基于上游产出继续。`,
  };
  return map[upstreamKey]?.[downstreamKey] ?? fallback;
}

const roster: AgentSpec[] = [
  {
    key: "listing-pro",
    name: "Listing 优化员",
    title: "Senior Listing Specialist",
    role: "listing-optimizer",
    icon: "📝",
    capabilities:
      "亚马逊 US/EU/JP 上架；标题 + 5 bullets + A+ 大纲 + 后台 Search Terms 230 字符。",
    skillSlug: "amazon-listing-optimization",
    status: "idle",
  },
  {
    key: "niche-finder",
    name: "选品调研员",
    title: "Product Sourcing Analyst",
    role: "sourcing-analyst",
    icon: "🔍",
    capabilities:
      "周度 niche 扫描；竞争度 + 利润率 + 进入难度评分；推荐 5 个可执行机会。",
    skillSlug: "amazon-niche-finder",
    status: "idle",
  },
  {
    key: "keyword",
    name: "关键词策略员",
    title: "Keyword & SEO Strategist",
    role: "keyword-strategist",
    icon: "🔑",
    capabilities:
      "Tier 1/2/3 三层关键词矩阵；Rufus / COSMO 友好句式；Search Terms 合规生成。",
    skillSlug: "amazon-keyword-research",
    status: "idle",
  },
  {
    key: "cfo",
    name: "Ecom CFO",
    title: "Fractional CFO",
    role: "finance-analyst",
    icon: "💰",
    capabilities:
      "月度 P&L · 单位经济 · 现金转换周期 · 真实广告效率 · 估值参考 · 3 个动手建议。",
    skillSlug: "ecom-cfo",
    status: "idle",
  },
  {
    key: "expansion",
    name: "出海评估员",
    title: "Market Expansion Strategist",
    role: "expansion-strategist",
    icon: "🌍",
    capabilities:
      "8 维度市场打分（US/DE/JP/UK/AU/CA/BR/MX）；5 种履约模型比较；分阶段进入路线图。",
    skillSlug: "cross-border-ecommerce",
    status: "idle",
  },
  {
    key: "fba",
    name: "FBA 库存员",
    title: "FBA Inventory Watcher",
    role: "operations-analyst",
    icon: "📦",
    capabilities:
      "SKU 周转扫描；30 天断货预警；120 天积压清单；仓储费蚕食测算。",
    skillSlug: "amazon-niche-finder",
    status: "paused",
  },
  {
    key: "compliance",
    name: "跨境合规员",
    title: "Cross-Border Compliance Officer",
    role: "compliance-officer",
    icon: "✅",
    capabilities:
      "FDA / CE / CCC / EORI / VAT 申报材料预审；附下载清单；备案号查询。",
    skillSlug: "cross-border-ecommerce",
    status: "paused",
  },
  {
    key: "adcopy",
    name: "Ads 文案员",
    title: "Performance Copywriter",
    role: "ad-copywriter",
    icon: "✏️",
    capabilities:
      "Sponsored Brand / Display / TikTok / Meta 多端文案；A/B 变体；CTR 优化。",
    skillSlug: "amazon-listing-optimization",
    status: "paused",
  },
];

export const AGENT_KEYS = roster.map((a) => a.key);

export const AGENT_SKILLS = Object.fromEntries(
  roster.map((a) => [a.key, a.skillSlug] as const),
);

function buildInstructions(spec: AgentSpec): string {
  const skillBody = SKILL_TEXT[spec.skillSlug];
  const skillBlock = skillBody
    ? `

## 你的核心 SOP — SKILL.md (\`${spec.skillSlug}\`)

> 这是你工作时必须严格遵循的 playbook。下面是完整内容，不要去外部 cat / find 文件，直接按下面章节产出。

\`\`\`markdown
${skillBody}
\`\`\``
    : `

## 你的核心 SOP — SKILL.md (\`${spec.skillSlug}\`)

> ⚠️ 该 SKILL 未在本插件 inline。Sprint 2 的 G1 任务会补齐。先按通用 SOP 工作。`;

  return `# ${spec.name} · ${spec.title}

你是 OPC（跨境一人公司）的 ${spec.name}，岗位职能：${spec.capabilities}

## 工作守则

1. 收到任务时先确认业务情境：站点、品类、目标市场（如果用户已给则直接进入工作）。
2. 严格按下方「核心 SOP」章节工作。SOP 是你的 playbook，每个产出步骤都要对应到 SOP 里的章节。
3. 高风险动作（上架、扣款、跨境申报、客户外联）一律输出方案 + 等用户人工确认，**不要自行执行**。
4. 涉及金额、时间、合规口径，标注数据来源；不确定的标 \`[需核实]\`。
5. 用中文交付。如果用户用英文写需求，按英文交付。
6. 节奏：先 30 秒摘要 → 再展开详细方案。
7. 如果用户给的需求里已经包含了产出所需的所有信息（产品规格、目标市场等），直接开干交付完整产出，**不要反过来让用户填表**。

## 输出格式

- 用 Markdown
- 关键数字用表格
- 每段末尾给「下一步可执行动作」

## 你不会做什么

- 不替用户做最终决策
- 不在没人看的情况下点提交
- 不绕开审计日志
${skillBlock}`;
}

export const managedAgents: PluginManagedAgentDeclaration[] = roster.map(
  (spec) => ({
    agentKey: spec.key,
    displayName: `${spec.icon} ${spec.name}`,
    role: spec.role,
    title: spec.title,
    icon: spec.icon,
    capabilities: spec.capabilities,
    status: spec.status,
    adapterType: "codex_local",
    adapterPreference: ["codex_local", "claude_local", "process"],
    instructions: {
      content: buildInstructions(spec),
    },
  }),
);
