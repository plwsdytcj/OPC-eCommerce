import type { ToolResult } from "@paperclipai/plugin-sdk";

/**
 * MOCK：根据种子关键词，返回搜索量 / 竞争度估算。
 * 真实集成换成 Helium10 / Jungle Scout / DataDive API。
 */

interface Params {
  seeds: string[];
  market?: string;
}

interface KeywordRow {
  keyword: string;
  monthlyVolume: number;
  competition: "low" | "medium" | "high";
  cpcUsd: number;
  tier: "T1" | "T2" | "T3";
  rufusFriendly: boolean;
}

function hashSeed(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function buildKeywords(seed: string): KeywordRow[] {
  const h = hashSeed(seed);
  const baseVol = 8000 + (h % 25000);
  const expansions: Array<[string, "T1" | "T2" | "T3", boolean]> = [
    [seed, "T1", false],
    [`${seed} for travel`, "T2", true],
    [`best ${seed} 2026`, "T2", true],
    [`${seed} fast charging`, "T2", false],
    [`${seed} laptop compatible`, "T3", true],
    [`is ${seed} safe for iphone 16`, "T3", true],
    [`${seed} vs anker`, "T3", true],
  ];
  return expansions.map(([kw, tier, rufus], idx) => {
    const vol = Math.max(
      400,
      Math.floor(baseVol / (idx + 1) - (idx % 2 ? 1200 : 0)),
    );
    return {
      keyword: kw,
      monthlyVolume: vol,
      competition: idx < 2 ? "high" : idx < 4 ? "medium" : "low",
      cpcUsd: Number(((0.8 + (idx * 0.13)) % 4).toFixed(2)),
      tier,
      rufusFriendly: rufus,
    };
  });
}

export async function amazonKeywordVolumes(params: Params): Promise<ToolResult> {
  const market = params.market ?? "US";
  const seeds = params.seeds.slice(0, 5);
  const allRows: KeywordRow[] = [];
  for (const s of seeds) allRows.push(...buildKeywords(s));

  // 去重 + 排序
  const dedup = new Map<string, KeywordRow>();
  for (const r of allRows) {
    if (!dedup.has(r.keyword)) dedup.set(r.keyword, r);
  }
  const rows = Array.from(dedup.values()).sort(
    (a, b) => b.monthlyVolume - a.monthlyVolume,
  );

  const table = [
    "| Tier | Keyword | Volume/mo | 竞争度 | CPC | Rufus |",
    "|------|---------|-----------|--------|-----|-------|",
    ...rows.map(
      (r) =>
        `| ${r.tier} | ${r.keyword} | ${r.monthlyVolume.toLocaleString()} | ${r.competition} | $${r.cpcUsd} | ${r.rufusFriendly ? "✓" : "—"} |`,
    ),
  ].join("\n");

  return {
    content: [
      `🔑 关键词搜索量（Amazon ${market}，seeds: ${seeds.join(", ")}）`,
      "",
      table,
      "",
      "_注：mock 数据；真实接通换 Helium10/Jungle Scout API。_",
    ].join("\n"),
    data: { market, seeds, rows },
  };
}
