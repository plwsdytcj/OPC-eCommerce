export interface CompareRow {
  dimension: string;
  manual: string;
  chatgpt: string;
  opc: string;
  opcHighlight?: boolean;
}

export const compareRows: CompareRow[] = [
  {
    dimension: "月度成本",
    manual: "¥15,000+ 雇 1 人",
    chatgpt: "¥200 / 月",
    opc: "Phase 1 内测免费",
    opcHighlight: true,
  },
  {
    dimension: "上手时间",
    manual: "2 周入职 + 3 月磨合",
    chatgpt: "立刻，但每次重头",
    opc: "30 秒进工作台 · 它记得你",
    opcHighlight: true,
  },
  {
    dimension: "半夜会自己跑吗",
    manual: "不会",
    chatgpt: "不会",
    opc: "会。你下班它上班",
    opcHighlight: true,
  },
  {
    dimension: "多线并行",
    manual: "1 人 1 件事",
    chatgpt: "1 个对话 1 件事",
    opc: "选品员 / Listing 员 / CFO 同时跑",
  },
  {
    dimension: "出错谁兜底",
    manual: "你",
    chatgpt: "你 + 截图自取",
    opc: "全审计日志 · 高风险动作必须你确认",
  },
  {
    dimension: "跨境合规",
    manual: "看你雇的人懂不懂",
    chatgpt: "通用知识",
    opc: "内置美 / 欧 / 日 / 澳合规清单",
  },
];
