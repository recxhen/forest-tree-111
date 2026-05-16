/**
 * 產出可上傳至 R2/CDN 根目錄的 theme.publish.json（與 HypeLink 平台 v1/v2 合約對齊）。
 * 預設產出 v2 格式（ESM bundle，entry module 為 theme-entry.js）；HYPELINK_THEME_VERSION=v1 時退回 v1。
 * 執行：node scripts/write-theme-publish.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function readJson(rel) {
  const p = path.join(root, rel);
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function entryToModule(entry) {
  const s = String(entry).replace(/^\.\//, "");
  return s.replace(/\.tsx$/i, ".js").replace(/\.ts$/i, ".js");
}

const manifest = readJson("config/theme.manifest.json");
const meta = readJson("theme.meta.json");
let defaultSettings = {};
try {
  defaultSettings = readJson("examples/settings.sample.json");
} catch {
  /* optional */
}

const motion = {
  screen: { tabTransition: "fade", durationMs: 260 },
  enter: { preset: "fade_in", speed: 1 },
  exit: { preset: "fade_out", speed: 1 },
  continuous: {
    preset: "none",
    targetElement: "avatar",
    speed: 1,
    intensity: 0,
  },
};

const isV1 = (process.env.HYPELINK_THEME_VERSION || "").trim().toLowerCase() === "v1";
const isV2 = !isV1;

const publish = {
  schemaVersion: "1.0",
  package: manifest,
  meta,
  motion,
  defaultSettings,
  assets: {
    kind: isV2 ? "hypelink-theme-v2" : "hypelink-theme-v1",
    entryModule: isV2 ? "theme-entry.js" : entryToModule(manifest.entry),
    note: isV2
      ? "v2 ESM bundle：將 dist/esm/ 目錄上傳至 R2；公開頁會 dynamic import theme-entry.js 載入主題元件。"
      : "將整個 dist/ 目錄上傳至 R2 路徑（例：themes/artifacts/{packageId}/{version}/）；管理後台填寫對應公開 URL 為 artifact 根目錄。",
  },
};

const outDir = path.join(root, "dist");
fs.mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, "theme.publish.json");
fs.writeFileSync(outFile, JSON.stringify(publish, null, 2), "utf8");
console.log("Wrote", path.relative(root, outFile));
