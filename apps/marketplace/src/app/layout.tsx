import type { Metadata } from "next";
import { fraunces, newsreader, jetbrains } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "OPC · 跨境一人公司的 AI 员工平台",
  description:
    "为跨境 OPC 园区准备的 AI 公司操作系统：员工 24×7 不下班，自动出 Listing、做选品、报关键词、看月度财务。",
  metadataBase: new URL("http://localhost:3200"),
  openGraph: {
    title: "OPC · 跨境一人公司的 AI 员工平台",
    description: "AI 员工 24×7 不下班。今晚 8 点开始替你跑店。",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${fraunces.variable} ${newsreader.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
