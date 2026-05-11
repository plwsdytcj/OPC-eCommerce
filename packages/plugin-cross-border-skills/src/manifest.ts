import type { PaperclipPluginManifestV1 } from "@paperclipai/plugin-sdk";
// SKILL.md 在构建时被 esbuild text loader 内嵌为字符串
// @ts-ignore — esbuild 处理
import listingMd from "../../db/seeds/skills/listing/amazon-listing-optimization.md";
// @ts-ignore
import sourcingMd from "../../db/seeds/skills/sourcing/amazon-niche-finder.md";
// @ts-ignore
import keywordMd from "../../db/seeds/skills/keyword/amazon-keyword-research.md";
// @ts-ignore
import financeMd from "../../db/seeds/skills/finance/ecom-cfo.md";
// @ts-ignore
import expansionMd from "../../db/seeds/skills/expansion/cross-border-ecommerce.md";

const manifest: PaperclipPluginManifestV1 = {
  id: "opc.cross-border-skills",
  apiVersion: 1,
  version: "0.1.0",
  displayName: "OPC Cross-Border Skills",
  description:
    "Five production-grade Amazon / cross-border e-commerce SKILL.md, from MIT-licensed sources (nexscope-ai, jeffreydebolt). Auto-installs into every company on this Paperclip instance.",
  author: "OPC Park",
  categories: ["connector"],
  capabilities: [
    "skills.managed",
    "companies.read",
    "events.subscribe",
    "ui.dashboardWidget.register",
  ],
  entrypoints: {
    worker: "./dist/worker.js",
    ui: "./dist/ui",
  },
  skills: [
    {
      skillKey: "amazon-listing-optimization",
      slug: "amazon-listing-optimization",
      displayName: "Amazon Listing Optimization",
      description:
        "Build keyword-optimized listings from scratch, or audit existing ones across 8 dimensions.",
      markdown: listingMd as unknown as string,
    },
    {
      skillKey: "amazon-niche-finder",
      slug: "amazon-niche-finder",
      displayName: "Amazon Niche Finder",
      description: "Find profitable niches via competition + opportunity analysis.",
      markdown: sourcingMd as unknown as string,
    },
    {
      skillKey: "amazon-keyword-research",
      slug: "amazon-keyword-research",
      displayName: "Amazon Keyword Research",
      description:
        "Tier 1-3 keyword discovery with COSMO / Rufus optimization and Search Terms compliance.",
      markdown: keywordMd as unknown as string,
    },
    {
      skillKey: "ecom-cfo",
      slug: "ecom-cfo",
      displayName: "Ecommerce CFO",
      description:
        "Fractional CFO playbook for $500K–$30M Amazon/Shopify sellers — unit economics, CCC, ad efficiency, valuation.",
      markdown: financeMd as unknown as string,
    },
    {
      skillKey: "cross-border-ecommerce",
      slug: "cross-border-ecommerce",
      displayName: "Cross-Border E-Commerce Strategist",
      description:
        "Score target markets on 8 dimensions, compare 5 fulfillment models, country-by-country tax compliance, phased expansion roadmap.",
      markdown: expansionMd as unknown as string,
    },
  ],
  ui: {
    slots: [
      {
        type: "dashboardWidget",
        id: "opc-skills-status",
        displayName: "OPC Cross-Border Skills",
        exportName: "DashboardWidget",
      },
    ],
  },
};

export default manifest;
