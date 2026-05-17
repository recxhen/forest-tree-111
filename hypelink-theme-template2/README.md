# HypeLink Theme - Editorial Grid

可獨立開發的 HypeLink 主題模組（Next.js + Tailwind），與平台 **`theme.publish.json` v1** 合約對齊。

## 目錄結構（與主專案 `hypelink/src/lib/hypelink-theme-contract.ts` 語意一致）

| 路徑 | 說明 |
|------|------|
| `config/theme.manifest.json` | 套件 manifest 單一來源（`id` / **`author`** / `entry` / `capabilities` 等；`author` 會寫入 publish 並出現在主題庫） |
| `theme.config.ts` | 開發時 re-export manifest（供型別與工具讀取） |
| `theme.meta.json` | 市集／後台分類用 metadata |
| `settings.schema.ts` | 品牌可調 Zod schema |
| `types/index.ts` | 平台注入的 `ThemeContext` 型別 |
| `app/layout.tsx` | Next App Root（靜態輸出用） |
| `app/page.tsx` | SSG 預覽頁：以 `mock` 的 `full` 資料渲染 `theme-entry` |
| `app/theme-entry.tsx` | 唯一 runtime 入口（平台載入時亦指向此元件） |
| `components/ThemePreviewLayout.tsx` | 客戶端：主版面狀態（連結／Shop／會員、Link／Space）與底欄；依 `settings.desktopLayout.mode` 切換傳統／OS 桌面 |
| `components/ThemeBottomBar.tsx` | 客戶端：底欄 UI（樣式取自 `settings.bottomBar`） |
| `components/desktop/*` | 桌面 OS 模式（lg 以上）：桌布、Dock、可拖移視窗、視窗內容分派 |
| `lib/desktop-rect.ts` | 視窗錨點＋大小 → px 座標（移植自平台 `resolveBrandDesktopAppRect`） |
| `next.config.mjs` | `output: 'export'` → **Next.js SSG 靜態專案**，產物目錄 `out/` |
| `mock/*.json` | **ThemeContext** 假資料（完整／最小／grid／split／**desktop-os**）；索引 `mock/manifest.json`。本地預覽切換：`/?mock=desktop-os` |
| `lib/mock-context.ts` | `getMockContext('full' \| …)` 型別化載入 mock |
| `examples/theme.publish.v1.json` | v1 合約範例（等同 build 產物形狀） |
| `examples/example-context.json` | 較精簡的 ThemeContext（與 mock 並存） |
| `scripts/write-theme-publish.mjs` | 產出 `dist/theme.publish.json` |
| `scripts/copy-publish-to-out.mjs` | 建置後將 `theme.publish.json` 複製到 `out/` 根目錄 |

開發時可在暫存頁或測試中：`import { getMockContext } from './lib/mock-context'` 後將回傳物件作為 `<ThemeEntry context={…} />` 的 `context`。

## 建置：Next.js SSG（靜態 `out/`）

本模板以 **`next build` + `output: 'export'`** 產出**純靜態**網站（無 Node server），與「可上傳 CDN／R2 的 artifact」一致。

1. **安裝**：`pnpm install`
2. **本機預覽**：`pnpm dev`（熱重載；預設無 `basePath`，在 `http://localhost:3000/` 開發）
3. **正式建置**（擇一）  
   - **`pnpm build`**：產物中的資源路徑為 `/_next/...`，適合將 **`out/` 整包上傳到「網域根」或「僅服務此 artifact 的子網域」**（例如 `https://cdn.example.com/index.html` 與 `https://cdn.example.com/_next/...` 同層）。  
   - **`pnpm build:hypelink-public`**：設定 `basePath` 為 **`/hypelink-theme-template/out`**，HTML 內改為 **`/hypelink-theme-template/out/_next/...`**。請在主專案 **`hypelink`** 內、將 `out/` 置於 **`public/hypelink-theme-template/out/`** 時使用，否則瀏覽器會向主站根目錄要 `/_next/...` 而載到錯誤的 JS/CSS。  
   - 兩者皆會：`write-publish` → `next build`（SSG）→ 將 `dist/theme.publish.json` 複製為 **`out/theme.publish.json`**
4. **上傳**：將整個 **`out/`** 目錄上傳至 R2（例如 `themes/artifacts/{packageId}/{version}/`），公開 URL 為該目錄的 **artifact 根**（無結尾 `/`）。若公開網址含子路徑（例如 `https://cdn/team/pkg/1.0.0/`），建置時需設定 **`HYPELINK_THEME_STATIC_BASE_PATH`** 與該公開路徑一致（與 `pnpm build:hypelink-public` 同理）。
5. 管理後台「設計主題」填寫該 artifact 根 URL，並可貼上 `theme.publish.json` 內容以帶入套件欄位（與 `out/theme.publish.json` 一致）。

### 嵌於主專案 `public/` 時如何驗證

啟動 **`hypelink`** 開發伺服器後，在瀏覽器開啟：

- `http://localhost:3000/hypelink-theme-template/out/index.html`（或省略 `index.html`）
- 開發者工具 Network 應看到 CSS/JS 自 **`/hypelink-theme-template/out/_next/...`** 回傳 **200**（非主站的 `/_next/...`）。

`theme.publish.json` 應可 GET：**`/hypelink-theme-template/out/theme.publish.json`**。

## 平台管線（摘要）

1. 後台建立主題並填寫 artifact 根 URL + 貼上 publish JSON（或手動填 package 欄位）。
2. 公開 API **`GET /platform/theme-catalog`** 回傳已上架主題（含 `publishManifestUrl` 等），供品牌後台「設計」讀取。
3. Runtime 自 `${artifactBaseUrl}/theme.publish.json` 載入後再載入 `assets.entryModule`（由正式 build worker 產出）。

## Notes

- 此套件為 **theme module**，不是完整獨立產品站；勿提交 `node_modules`、`.next`、`.env`。若需將 **`out/`** 一併納入主專版控以供「設計 → 主題範本」預覽，請以 **`pnpm build:hypelink-public`** 產出並確認路徑一節所述。
- 平台資料僅能透過 `ThemeContext` 注入，主題內勿實作私有資料 API。
- **桌面版設計**：`settings.desktopLayout`（`mode` / `backgroundUrl` / `apps[]`）由「首頁設計 → 桌面版設計」產出，平台隨 `...designSettings` 帶入。`mode==='os'` 在 `lg` 以上渲染 macOS 風格桌面，`<lg` 維持手機列表。**勿**把 `desktopLayout` 寫進 `examples/settings.sample.json`（會進 publish `defaultSettings`，每次 refresh 蓋回使用者選擇）。
