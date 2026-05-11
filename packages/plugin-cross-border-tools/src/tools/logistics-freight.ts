import type { ToolResult } from "@paperclipai/plugin-sdk";

/**
 * MOCK：跨境海/空运估价。
 * 真实集成换成 Flexport / DHL / FedEx / Freightos API。
 */

interface Params {
  origin: string;
  destination: string;
  weightKg: number;
  volumeCbm?: number;
  mode?: "sea" | "air" | "express";
}

interface Quote {
  carrier: string;
  mode: "sea" | "air" | "express";
  transitDays: string;
  ratePerKgUsd: number | null;
  flatRateUsd: number | null;
  estTotalUsd: number;
  notes: string;
}

export async function logisticsEstimateFreight(
  params: Params,
): Promise<ToolResult> {
  const weight = Math.max(1, params.weightKg);
  const volCbm = params.volumeCbm ?? weight / 200;
  const chargeable = Math.max(weight, volCbm * 167);

  const lane = `${params.origin.toUpperCase()} → ${params.destination.toUpperCase()}`;

  const quotes: Quote[] = [
    {
      carrier: "Flexport (Sea FCL)",
      mode: "sea",
      transitDays: "28-35 天",
      ratePerKgUsd: null,
      flatRateUsd: 4200,
      estTotalUsd: 4200,
      notes: "20'GP 整柜；建议库存 ≥ 1500kg",
    },
    {
      carrier: "Flexport (Sea LCL)",
      mode: "sea",
      transitDays: "32-42 天",
      ratePerKgUsd: 1.4,
      flatRateUsd: null,
      estTotalUsd: Math.round(chargeable * 1.4),
      notes: "拼柜；含目的港费",
    },
    {
      carrier: "DHL eCommerce (Air)",
      mode: "air",
      transitDays: "7-12 天",
      ratePerKgUsd: 4.8,
      flatRateUsd: null,
      estTotalUsd: Math.round(chargeable * 4.8),
      notes: "经济空派；不含尾派",
    },
    {
      carrier: "FedEx IP (Express)",
      mode: "express",
      transitDays: "3-5 天",
      ratePerKgUsd: 9.2,
      flatRateUsd: null,
      estTotalUsd: Math.round(chargeable * 9.2),
      notes: "门到门；适合补单",
    },
  ];

  const filtered = params.mode
    ? quotes.filter((q) => q.mode === params.mode)
    : quotes;

  const table = [
    "| 渠道 | 时效 | 单价 | 估算总价 | 说明 |",
    "|------|------|------|----------|------|",
    ...filtered.map(
      (q) =>
        `| ${q.carrier} | ${q.transitDays} | ${
          q.ratePerKgUsd
            ? `$${q.ratePerKgUsd}/kg`
            : `$${q.flatRateUsd} 整柜`
        } | $${q.estTotalUsd.toLocaleString()} | ${q.notes} |`,
    ),
  ].join("\n");

  return {
    content: [
      `🚢 物流报价  ${lane}`,
      `重量 ${weight}kg · 计费重 ${chargeable.toFixed(1)}kg · 体积 ${volCbm.toFixed(3)}m³`,
      "",
      table,
      "",
      "_注：mock 估算，真实价请向货代询价。_",
    ].join("\n"),
    data: { lane, chargeable, quotes: filtered },
  };
}
