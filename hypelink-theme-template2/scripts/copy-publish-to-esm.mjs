/**
 * 在 `vite build`（library mode）完成後，將 `dist/theme.publish.json` 複製到 `dist/esm/`，
 * 方便與 ESM bundle 一併打包上傳 artifact。
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const src = path.join(root, "dist", "theme.publish.json");
const dest = path.join(root, "dist", "esm", "theme.publish.json");

if (!fs.existsSync(path.join(root, "dist", "esm"))) {
  console.warn("copy-publish-to-esm: skip (no dist/esm/ — run vite build first)");
  process.exit(0);
}
if (!fs.existsSync(src)) {
  console.warn("copy-publish-to-esm: skip (no dist/theme.publish.json — run write-publish first)");
  process.exit(0);
}
fs.copyFileSync(src, dest);
console.log("Copied dist/theme.publish.json → dist/esm/theme.publish.json");
