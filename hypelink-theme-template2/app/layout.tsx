import type { Metadata } from "next";
import { Noto_Sans_TC } from "next/font/google";

import "./globals.css";

const notoSansTc = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  variable: "--font-noto-tc",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HypeLink Theme Preview",
  description: "Static export preview for HypeLink theme package",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant" className={notoSansTc.variable}>
      <body className={notoSansTc.className}>{children}</body>
    </html>
  );
}
