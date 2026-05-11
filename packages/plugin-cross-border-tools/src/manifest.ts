import type {
  PaperclipPluginManifestV1,
  JsonSchema,
} from "@paperclipai/plugin-sdk";

const stringList: JsonSchema = {
  type: "array",
  items: { type: "string" },
  minItems: 1,
  maxItems: 8,
};

const manifest: PaperclipPluginManifestV1 = {
  id: "opc.cross-border-tools",
  apiVersion: 1,
  version: "0.1.0",
  displayName: "OPC Cross-Border Tools",
  description:
    "OPC 跨境工具集（mock 阶段）：Amazon 竞品扫描 / 关键词搜索量 / 跨境物流估价 / 合规清单。真实接通会换成 SP-API、Helium10、Flexport 等。",
  author: "OPC Park",
  categories: ["connector"],
  capabilities: ["agent.tools.register"],
  entrypoints: {
    worker: "./dist/worker.js",
    ui: "./dist/ui",
  },
  tools: [
    {
      name: "amazon_search_competitors",
      displayName: "Amazon 竞品扫描",
      description:
        "按关键词扫描 Amazon 某站点的 top-5 竞品，返回 ASIN、价格、评分、评论、BSR、Prime 状态。用于选品、对标分析、Listing 调研。",
      parametersSchema: {
        type: "object",
        properties: {
          query: { type: "string", description: "搜索关键词，例如 \"65w gan charger\"" },
          market: {
            type: "string",
            enum: ["US", "DE", "UK", "JP", "FR", "ES", "IT", "AU", "CA"],
            default: "US",
          },
          limit: { type: "integer", minimum: 1, maximum: 10, default: 5 },
        },
        required: ["query"],
      },
    },
    {
      name: "amazon_get_keyword_volumes",
      displayName: "Amazon 关键词搜索量",
      description:
        "传入 1-5 个种子关键词，返回扩展词表 + 月搜索量 + 竞争度 + CPC + Rufus 友好度。给关键词策略员、Listing 优化员用。",
      parametersSchema: {
        type: "object",
        properties: {
          seeds: stringList,
          market: { type: "string", enum: ["US", "DE", "UK", "JP"], default: "US" },
        },
        required: ["seeds"],
      },
    },
    {
      name: "logistics_estimate_freight",
      displayName: "跨境物流估价",
      description:
        "估算从中国到目标市场的物流费用（海运 FCL/LCL、空派、快递）。给出海评估员、FBA 库存员用。",
      parametersSchema: {
        type: "object",
        properties: {
          origin: { type: "string", description: "出发地，例如 \"CN-Shenzhen\" 或 \"CN\"" },
          destination: { type: "string", description: "目的地国家代码或港口，例如 \"US-LAX\" 或 \"DE\"" },
          weightKg: { type: "number", minimum: 1, description: "实重 kg" },
          volumeCbm: { type: "number", minimum: 0, description: "体积 m³（可选）" },
          mode: { type: "string", enum: ["sea", "air", "express"], description: "只看某种模式（可选）" },
        },
        required: ["origin", "destination", "weightKg"],
      },
    },
    {
      name: "compliance_lookup",
      displayName: "合规清单查询",
      description:
        "查询某品类进入某市场的合规清单（FCC、CE、PSE、Prop65 等）。给合规员、出海评估员用。当前 mock 覆盖 electronics / pet / textile。",
      parametersSchema: {
        type: "object",
        properties: {
          category: {
            type: "string",
            description: "品类，例如 electronics, pet, textile",
          },
          market: {
            type: "string",
            enum: ["US", "EU", "JP", "UK", "DE", "FR"],
          },
        },
        required: ["category", "market"],
      },
    },
  ],
};

export default manifest;
