import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "國立政治大學研發處企畫組兼任助理交接手冊",
  description: "為國立政治大學研發處企畫組兼任助理量身整理的工作交接手冊。",
  other: {
    "codex-preview": "development",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
