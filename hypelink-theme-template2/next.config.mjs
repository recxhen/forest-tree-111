import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * 若主題 `out/` 要放在主專案 `public/hypelink-theme-template/out/` 底下供靜態讀取，
 * 必須設定與 URL 路徑一致的前綴，否則 HTML 內 `/_next/...` 會打到主站根目錄而載錯資源。
 * 範例：`HYPELINK_THEME_STATIC_BASE_PATH=/hypelink-theme-template/out pnpm run build:hypelink-public`
 */
const rawBase = (process.env.HYPELINK_THEME_STATIC_BASE_PATH || "").trim();
const basePath =
  rawBase.replace(/\/+$/, "") === "" ? undefined : rawBase.replace(/\/+$/, "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /** 靜態輸出（SSG）：產物為 `out/`，可整包上傳 CDN／R2 */
  output: "export",
  images: {
    unoptimized: true,
  },
  ...(basePath ? { basePath } : {}),
  /** 避免巢狀於 monorepo 時誤用外層 lockfile 為 workspace root */
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
