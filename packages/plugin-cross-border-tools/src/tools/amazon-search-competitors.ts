import type { ToolResult } from "@paperclipai/plugin-sdk";

/**
 * MOCK：基于关键词返回 5 个虚构的亚马逊竞品。
 * 真实集成会换成 Amazon SP-API / RapidAPI ScraperAPI。
 */

interface Params {
  query: string;
  market?: string;
  limit?: number;
}

interface Competitor {
  asin: string;
  title: string;
  brand: string;
  priceUsd: number;
  rating: number;
  reviewCount: number;
  bsr: number;
  fbaPrime: boolean;
}

const FIXTURES: Record<string, Competitor[]> = {
  default: [
    {
      asin: "B0CXMOCK01",
      title: "Anker 65W GaN Charger 3-Port USB-C Power Adapter",
      brand: "Anker",
      priceUsd: 39.99,
      rating: 4.7,
      reviewCount: 12483,
      bsr: 124,
      fbaPrime: true,
    },
    {
      asin: "B0CXMOCK02",
      title: "UGREEN Nexode 65W Charger 3-Port PPS GaN Fast Charging",
      brand: "UGREEN",
      priceUsd: 32.99,
      rating: 4.6,
      reviewCount: 8731,
      bsr: 287,
      fbaPrime: true,
    },
    {
      asin: "B0CXMOCK03",
      title: "Baseus 65W USB-C Charger PD3.0 Foldable",
      brand: "Baseus",
      priceUsd: 27.99,
      rating: 4.5,
      reviewCount: 4318,
      bsr: 612,
      fbaPrime: true,
    },
    {
      asin: "B0CXMOCK04",
      title: "RAVPower 65W Pioneer GaN II Charger",
      brand: "RAVPower",
      priceUsd: 35.99,
      rating: 4.4,
      reviewCount: 2189,
      bsr: 938,
      fbaPrime: false,
    },
    {
      asin: "B0CXMOCK05",
      title: "INIU 65W Fast Charger Wall Adapter GaN Tech",
      brand: "INIU",
      priceUsd: 24.99,
      rating: 4.3,
      reviewCount: 1672,
      bsr: 1547,
      fbaPrime: true,
    },
  ],
};

export async function amazonSearchCompetitors(
  params: Params,
): Promise<ToolResult> {
  const limit = params.limit ?? 5;
  const market = params.market ?? "US";
  const competitors = FIXTURES.default.slice(0, limit);

  const summary = [
    `🛒 Amazon ${market} 竞品扫描结果（query: "${params.query}"，共 ${competitors.length} 个）`,
    "",
    competitors
      .map(
        (c, i) =>
          `${i + 1}. **${c.title}** \`${c.asin}\`
   品牌: ${c.brand}  ·  价格: $${c.priceUsd}  ·  评分: ${c.rating}（${c.reviewCount.toLocaleString()} 评论）
   BSR: #${c.bsr}  ·  FBA Prime: ${c.fbaPrime ? "是" : "否"}`,
      )
      .join("\n\n"),
    "",
    "_注：这是 mock 数据；真实接通会换成 Amazon SP-API。_",
  ].join("\n");

  return {
    content: summary,
    data: { market, query: params.query, competitors },
  };
}
