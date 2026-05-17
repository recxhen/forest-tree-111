/**
 * Next.js static export（output: 'export'）產出的 HTML 使用絕對路徑引用 _next 資源，
 * 例如 `/_next/static/chunks/xxx.js` 或帶 basePath 的 `/some/base/_next/...`。
 * 上傳至 R2 等 CDN 子目錄後這些絕對路徑會 404。
 *
 * 此腳本將 out/ 內所有 .html 檔案中的 _next 資源路徑重寫為相對路徑（./_next/...），
 * 使預覽在任何 hosting 子目錄下都能正確載入。
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "out");

if (!fs.existsSync(outDir)) {
  console.warn("fix-asset-paths: skip (no out/ directory)");
  process.exit(0);
}

/**
 * 遞迴收集目錄下所有 .html 檔案路徑
 */
function collectHtmlFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectHtmlFiles(full));
    } else if (entry.name.endsWith(".html") || entry.name.endsWith(".htm")) {
      results.push(full);
    }
  }
  return results;
}

/**
 * 將 HTML 中指向 _next 的絕對路徑改為相對路徑。
 *
 * 匹配模式：
 * 1. src|href 屬性：(src|href)="/任意前綴/_next/..." → "./_next/..."
 * 2. JS 字串（RSC payload 等）："/任意前綴/_next/..." → "./_next/..."
 */
function rewriteAssetPaths(html) {
  // 統一處理：所有引號內以 / 開頭、包含 _next/ 的路徑
  return html.replace(
    /(["'])\/[^"']*?(_next\/[^"']*)\1/g,
    (match, quote, nextPart) => `${quote}./${nextPart}${quote}`,
  );
}

const htmlFiles = collectHtmlFiles(outDir);
let rewrittenCount = 0;

for (const filePath of htmlFiles) {
  const original = fs.readFileSync(filePath, "utf8");
  const rewritten = rewriteAssetPaths(original);
  if (rewritten !== original) {
    fs.writeFileSync(filePath, rewritten, "utf8");
    rewrittenCount++;
    console.log(`fix-asset-paths: rewritten ${path.relative(outDir, filePath)}`);
  }
}

console.log(
  `fix-asset-paths: done (${rewrittenCount}/${htmlFiles.length} files rewritten)`,
);
