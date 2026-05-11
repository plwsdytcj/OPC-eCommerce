import { definePlugin, runWorker } from "@paperclipai/plugin-sdk";
import { amazonSearchCompetitors } from "./tools/amazon-search-competitors";
import { amazonKeywordVolumes } from "./tools/amazon-keyword-volumes";
import { logisticsEstimateFreight } from "./tools/logistics-freight";
import { complianceLookup } from "./tools/compliance-lookup";

const plugin = definePlugin({
  async setup(ctx) {
    ctx.tools.register(
      "amazon_search_competitors",
      {
        displayName: "Amazon 竞品扫描",
        description:
          "按关键词扫描 Amazon 某站点的 top-5 竞品，返回 ASIN、价格、评分、评论、BSR、Prime 状态。",
        parametersSchema: {
          type: "object",
          properties: {
            query: { type: "string" },
            market: { type: "string" },
            limit: { type: "integer" },
          },
          required: ["query"],
        },
      },
      async (params) => {
        ctx.logger.info("tool: amazon_search_competitors", { params });
        return amazonSearchCompetitors(params as Parameters<typeof amazonSearchCompetitors>[0]);
      },
    );

    ctx.tools.register(
      "amazon_get_keyword_volumes",
      {
        displayName: "Amazon 关键词搜索量",
        description: "扩展关键词并返回搜索量 / 竞争度 / CPC / Rufus 友好度。",
        parametersSchema: {
          type: "object",
          properties: {
            seeds: { type: "array", items: { type: "string" } },
            market: { type: "string" },
          },
          required: ["seeds"],
        },
      },
      async (params) => {
        ctx.logger.info("tool: amazon_get_keyword_volumes", { params });
        return amazonKeywordVolumes(params as Parameters<typeof amazonKeywordVolumes>[0]);
      },
    );

    ctx.tools.register(
      "logistics_estimate_freight",
      {
        displayName: "跨境物流估价",
        description: "估算 CN → 目标市场的海/空/快递报价。",
        parametersSchema: {
          type: "object",
          properties: {
            origin: { type: "string" },
            destination: { type: "string" },
            weightKg: { type: "number" },
            volumeCbm: { type: "number" },
            mode: { type: "string" },
          },
          required: ["origin", "destination", "weightKg"],
        },
      },
      async (params) => {
        ctx.logger.info("tool: logistics_estimate_freight", { params });
        return logisticsEstimateFreight(
          params as Parameters<typeof logisticsEstimateFreight>[0],
        );
      },
    );

    ctx.tools.register(
      "compliance_lookup",
      {
        displayName: "合规清单查询",
        description: "查询某品类进入某市场的合规清单。",
        parametersSchema: {
          type: "object",
          properties: {
            category: { type: "string" },
            market: { type: "string" },
          },
          required: ["category", "market"],
        },
      },
      async (params) => {
        ctx.logger.info("tool: compliance_lookup", { params });
        return complianceLookup(params as Parameters<typeof complianceLookup>[0]);
      },
    );

    ctx.logger.info("OPC cross-border-tools: 4 mock tools registered");
  },

  async onHealth() {
    return { status: "ok", message: "OPC tools worker live" };
  },
});

export default plugin;
runWorker(plugin, import.meta.url);
