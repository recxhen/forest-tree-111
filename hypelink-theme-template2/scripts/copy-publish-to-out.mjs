/**
 * 在 `next build`（output: export）完成後，將 `dist/theme.publish.json` 複製到 `out/` 根目錄，
 * 方便與靜態檔案一併上傳 artifact。
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const src = path.join(root, "dist", "theme.publish.json");
const dest = path.join(root, "out", "theme.publish.json");

if (!fs.existsSync(path.join(root, "out"))) {
  console.warn("copy-publish-to-out: skip (no out/ — run next build first)");
  process.exit(0);
}
if (!fs.existsSync(src)) {
  console.warn("copy-publish-to-out: skip (no dist/theme.publish.json — run write-publish first)");
  process.exit(0);
}
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.copyFileSync(src, dest);
console.log("Copied dist/theme.publish.json → out/theme.publish.json");
