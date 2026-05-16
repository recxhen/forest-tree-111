import type { Metadata } from "next";
import { Noto_Serif_TC } from "next/font/google";

import "./globals.css";

const notoSerifTc = Noto_Serif_TC({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-noto-serif-tc",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HypeLink 古典主題預覽",
  description: "HypeLink 古典風格品牌頁主題 — 靜態預覽",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant" className={notoSerifTc.variable}>
      <body className={notoSerifTc.className}>{children}</body>
    </html>
  );
}
