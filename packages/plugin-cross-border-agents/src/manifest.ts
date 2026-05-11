import type { PaperclipPluginManifestV1 } from "@paperclipai/plugin-sdk";
import { managedAgents } from "./agent-roster";

const manifest: PaperclipPluginManifestV1 = {
  id: "opc.cross-border-agents",
  apiVersion: 1,
  version: "0.2.0",
  displayName: "OPC Cross-Border Agents",
  description:
    "8 个 OPC 跨境 AI 员工：Listing 员 / 选品员 / 关键词员 / Ecom CFO / 出海评估员 / FBA 员 / 合规员 / Ads 文案员。每个员工绑定对应的 SKILL.md，自动入驻每家 company。同时暴露 marketplace 跳转接口 /api/plugins/opc.cross-border-agents/api/launch。",
  author: "OPC Park",
  categories: ["connector"],
  capabilities: [
    "agents.managed",
    "agents.read",
    "agents.invoke",
    "agent.sessions.create",
    "agent.sessions.send",
    "issues.read",
    "issues.create",
    "issues.update",
    "issues.wakeup",
    "companies.read",
    "events.subscribe",
    "api.routes.register",
  ],
  entrypoints: {
    worker: "./dist/worker.js",
    ui: "./dist/ui",
  },
  agents: managedAgents,
  apiRoutes: [
    {
      routeKey: "launch",
      method: "GET",
      path: "/launch",
      auth: "board",
      capability: "api.routes.register",
      companyResolution: { from: "query", key: "companyId" },
    },
  ],
};

export default manifest;
