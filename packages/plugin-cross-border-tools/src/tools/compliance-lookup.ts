import type { ToolResult } from "@paperclipai/plugin-sdk";

/**
 * MOCK：跨境合规要求查询。
 */

interface Params {
  category: string;
  market: string;
}

const TABLE: Record<string, Record<string, string[]>> = {
  electronics: {
    US: [
      "FCC Part 15B – Class B 电磁兼容（必须）",
      "DOE Energy Efficiency – 充电类目（必须）",
      "Prop65 警示标 – 加州销售（必须）",
      "WEEE 合规 – 加州、纽约电子回收（建议）",
    ],
    EU: [
      "CE 标记 + LVD + EMC 自我声明（必须）",
      "RoHS Directive 2011/65/EU 限制有害物质（必须）",
      "EU Cyber Resilience Act 2027 – 联网设备（生效中）",
      "EORI 进口商编号（必须）",
      "VAT 进口增值税 – DE: 19% / FR: 20%（必须）",
    ],
    JP: [
      "PSE 圆形 / 菱形 mark – 充电类目必须",
      "Telec / Giteki 无线模块认证（必须）",
      "JIS 安规对应（推荐）",
    ],
  },
  pet: {
    US: [
      "FDA – 食品 / 营养类产品（必须）",
      "Prop65 警示标 – 含化学物质（必须）",
      "AAFCO 营养声明合规（建议）",
    ],
  },
  textile: {
    US: [
      "FTC Care Label – 洗护标签（必须）",
      "Wool Products Labeling Act – 含羊毛（必须）",
      "CPSC Lead 测试 – 童装（必须）",
    ],
    EU: [
      "REACH SVHC 化学物质（必须）",
      "纤维含量标识 EU 1007/2011（必须）",
    ],
  },
};

export async function complianceLookup(params: Params): Promise<ToolResult> {
  const cat = params.category.toLowerCase();
  const mkt = params.market.toUpperCase();
  const requirements =
    TABLE[cat]?.[mkt] ??
    [`${cat} × ${mkt} 暂无 mock 数据。请改成 electronics / pet / textile × US / EU / JP 中的组合。`];

  return {
    content: [
      `✅ 合规清单  品类: ${cat}  ·  市场: ${mkt}`,
      "",
      ...requirements.map((r) => `- ${r}`),
      "",
      "_注：mock 清单；真实合规请咨询专业服务商。_",
    ].join("\n"),
    data: { category: cat, market: mkt, requirements },
  };
}
