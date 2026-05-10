import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import {
  agentTemplates,
  workspaces,
} from "./schema/index.js";

const url = process.env.DATABASE_URL ?? "postgresql://opc:opc@localhost:5432/opc";

async function main(): Promise<void> {
  const sql = postgres(url, { max: 1 });
  const db = drizzle(sql);

  console.log("Seeding agent_templates...");
  await db
    .insert(agentTemplates)
    .values([
      {
        slug: "listing-specialist",
        name: "Listing 专员",
        category: "listing",
        sourceType: "official",
        status: "active",
        description: "为 Amazon / Shopify 卖家生成与优化商品 Listing。",
        soulPrompt:
          "你是一名面向跨境 OPC 卖家的 Amazon/Shopify Listing 优化专家。" +
          "输出必须包含：标题、五点描述、Search Terms、风险词提醒。" +
          "对一切高风险操作（如直接修改店铺）必须提示用户人工确认。",
        skills: [
          { id: "competitor_breakdown", name: "竞品 Listing 拆解" },
          { id: "keyword_extraction", name: "关键词提取" },
          { id: "title_generation", name: "标题生成" },
          { id: "bullets_generation", name: "五点描述生成" },
          { id: "compliance_check", name: "合规词检查" },
        ],
        tools: [
          { kind: "file_reader" },
          { kind: "sheet_writer" },
        ],
        permissions: { read: ["product", "competitor"], write: ["draft"] },
        outputSchema: {
          type: "object",
          required: ["title", "bullets", "search_terms"],
          properties: {
            title: { type: "string" },
            bullets: { type: "array", items: { type: "string" } },
            search_terms: { type: "array", items: { type: "string" } },
            risk_words: { type: "array", items: { type: "string" } },
          },
        },
        version: "0.1.0",
      },
      {
        slug: "product-scout",
        name: "选品经理",
        category: "sourcing",
        sourceType: "official",
        status: "active",
        description: "市场机会分析、竞品拆解、产品评分。",
        soulPrompt:
          "你是一名跨境选品经理，擅长基于目标市场与平台输出可执行的选品建议与风险提醒。",
        skills: [
          { id: "market_opportunity", name: "市场机会分析" },
          { id: "competitor_breakdown", name: "竞品拆解" },
          { id: "profit_pre_calc", name: "利润初算" },
        ],
        tools: [{ kind: "web_search" }],
        permissions: { read: ["competitor", "market"] },
        outputSchema: { type: "object" },
        version: "0.1.0",
      },
      {
        slug: "finance-analyst",
        name: "财务利润分析师",
        category: "finance",
        sourceType: "official",
        status: "active",
        description: "测算售价、成本、毛利、盈亏平衡。",
        soulPrompt:
          "你是一名跨境电商财务分析师。请基于成本、运费、佣金、广告投入估算盈亏平衡点与建议定价。",
        skills: [
          { id: "profit_calc", name: "利润测算" },
          { id: "cost_breakdown", name: "成本拆解" },
          { id: "pricing", name: "定价建议" },
        ],
        tools: [{ kind: "sheet_writer" }],
        permissions: { read: ["product", "cost"], write: ["report"] },
        outputSchema: { type: "object" },
        version: "0.1.0",
      },
    ])
    .onConflictDoNothing();

  console.log("Seeding sample workspace...");
  const ownerId = "00000000-0000-0000-0000-000000000001";
  const inserted = await db
    .insert(workspaces)
    .values({
      ownerId,
      name: "CJ Pet Global (Demo)",
      businessType: "shopify",
    })
    .onConflictDoNothing()
    .returning({ id: workspaces.id });

  console.log("Seed complete. Sample workspace:", inserted[0]?.id ?? "(already existed)");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
