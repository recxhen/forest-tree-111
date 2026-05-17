# HypeLink Theme Template

HypeLink 品牌頁主題範本。
複製此專案即可開始製作你的自訂主題，完成後打包上傳至 HypeLink 平台。

---

## Quick Start

```bash
# 1. 複製範本並進入
cp -r hypelink-theme-template my-theme
cd my-theme

# 2. 安裝依賴
pnpm install

# 3. 啟動開發預覽
pnpm dev
# 開啟 http://localhost:3000 查看主題效果

# 4. 建置上傳用的打包檔
pnpm build:esm

# 5. 將 dist/esm/ 內的檔案壓縮為 ZIP 上傳至管理後台
cd dist/esm && zip -r ../../my-theme.zip .
```

---

## 必須設定的檔案

### `config/theme.manifest.json`

主題的身份資訊，上傳後顯示於主題庫。

```json
{
  "id": "your-theme-id",
  "name": "你的主題名稱",
  "version": "1.0.0",
  "author": "作者名稱",
  "description": "主題的簡短描述。",
  "entry": "./app/theme-entry.tsx",
  "previewImage": "./preview.png",
  "capabilities": [
    "profile", "social-links", "folder-items",
    "space-links", "theme-settings"
  ],
  "platform": { "minVersion": "1.0.0" }
}
```

### `theme.meta.json`

主題分類與標籤。

```json
{
  "category": "brand",
  "tags": ["minimal", "dark"],
  "supportsDarkMode": true,
  "supportsMobilePreview": true,
  "recommendedFor": ["creator", "brand"]
}
```

### `settings.schema.ts`

主題的可調整設定，使用 Zod 定義。品牌套用主題後，平台會傳入 settings。

```ts
export const ThemeSettingsSchema = z.object({
  layout: z.enum(['stack', 'grid', 'split']).default('stack'),
  accentColor: z.string().default('#7B61FF'),
  backgroundColor: z.string().default('#fafafa'),
  // ... 你的自訂設定
})
```

---

## 專案架構

```
my-theme/
├── app/
│   ├── theme-entry.tsx    ← 主題入口（必須 default export React 元件）
│   ├── globals.css        ← 全域樣式（Tailwind + 載入動畫）
│   ├── layout.tsx         ← Next.js layout（僅開發預覽用）
│   └── page.tsx           ← Next.js page（僅開發預覽用）
│
├── components/
│   ├── ThemeLoadingOrchestrator.tsx  載入四階段編排器
│   ├── ThemeSkeleton.tsx            骨架屏（資料未到時）
│   ├── ThemePreviewLayout.tsx       主佈局（側欄 + 內容 + 底欄）
│   ├── ThemeBottomBar.tsx           底部導覽列（連結/空間/Shop/會員）
│   ├── Hero.tsx                     品牌資訊區（頭像、名稱、簡介）
│   ├── SocialLinks.tsx              社群連結圓示列
│   ├── FolderGrid.tsx               連結資料夾 + 卡片網格
│   └── desktop/                     桌面 OS 模式（lg 以上）
│       ├── DesktopOsLayout.tsx      桌布 + 視窗 + Dock 編排器
│       ├── DesktopAppWindow.tsx     可拖移／縮放視窗（macOS chrome）
│       ├── DesktopAppContent.tsx    依 App 設定渲染視窗內容
│       └── DesktopDock.tsx          底部 Dock
│
├── lib/
│   ├── mock-context.ts   ← 型別化載入 mock fixture
│   ├── desktop-rect.ts   ← 視窗錨點＋大小 → px 座標
│   └── desktop-icon.ts   ← App 圖示對應
│
├── types/
│   └── index.ts           ← ThemeContext 型別定義（資料介面）
│
├── config/
│   └── theme.manifest.json  ← 主題身份資訊
│
├── settings.schema.ts     ← 可調整設定的 Zod schema
├── theme.meta.json        ← 分類與標籤
├── vite.config.ts         ← Vite 打包設定（build:esm 用）
├── next.config.mjs        ← Next.js 設定（dev 預覽用）
└── package.json
```

---

## 載入流程

主題進入時會經歷四個階段，由 `ThemeLoadingOrchestrator` 控制：

```
Stage 1: 開場          Stage 2: 載入中         Stage 3: 轉場          Stage 4: 內容
┌───────────┐       ┌───────────┐       ┌───────────┐       ┌───────────┐
│           │       │           │       │███████████│       │           │
│  [ Logo ] │  ──▶  │  [ Logo ] │  ──▶  │███████████│  ──▶  │  品牌頁面  │
│           │       │ ████░ 72% │       │███████████│       │           │
└───────────┘       └───────────┘       └───────────┘       └───────────┘
  品牌 Logo           進度條 + %          主色色塊滑入           帶動畫淡入
  淡入放大             Logo 脈動          蓋滿後滑出
  (0.6s)             (至資料 ready)      (0.8s)
```

### 自訂載入畫面

在 `theme-entry.tsx` 中調整 `ThemeLoadingOrchestrator` 的 props：

```tsx
<ThemeLoadingOrchestrator
  ready={ready}
  accentColor={settings.accentColor}    // 進度條 + 轉場色塊顏色
  logoUrl={context.profile?.avatarUrl}   // 開場 Logo（無則顯示品牌首字）
  brandName={context.profile?.name}      // 品牌名稱（取首字）
>
```

### 骨架屏

資料尚未載入時顯示 `ThemeSkeleton`（shimmer 動畫骨架），避免白屏：

```tsx
{ready ? (
  <ThemePreviewLayout context={context} settings={settings} />
) : (
  <ThemeSkeleton />
)}
```

自訂骨架屏請修改 `components/ThemeSkeleton.tsx`。

---

## 資料介面

主題元件接收 `ThemeContext` 作為 props，包含品牌的所有資料：

```ts
type ThemeContext = {
  profile: UserProfile        // 品牌資訊（名稱、頭像、簡介）
  socialLinks: SocialLink[]   // 社群連結
  folderItems: FolderItem[]   // 連結與資料夾
  spaceLinks: SpaceLink[]     // 3D 空間
  settings: Partial<Settings> // 主題設定
  slots?: ThemeSlots          // 平台注入的功能區塊
  activeTab?: string          // 平台管理的目前分頁
}
```

---

## Slots

平台將功能區塊作為 React nodes 注入，主題決定放在哪裡。
本地預覽時 `slots` 為空，主題應顯示占位 UI。

| Slot | 說明 | 建議位置 |
|------|------|---------|
| `slots.header` | 頂部導覽列（Logo + 使用者選單） | 頁面最上方 |
| `slots.dock` | 底部導覽列（4 tab + 愛心） | 頁面底部固定 |
| `slots.memberCta` | 會員 CTA（加入會員 / 會員徽章） | 側欄社群連結下方 |
| `slots.spaceEmbed` | 3D 空間嵌入 | 空間 tab 內容區 |
| `slots.shopTab` | 商城（商品列表） | Shop tab 內容區 |
| `slots.memberTab` | 會員中心 | 會員 tab 內容區 |

### 使用方式

```tsx
{/* Header */}
{context.slots?.header ? (
  <>{context.slots.header as React.ReactNode}</>
) : null}

{/* Dock：有平台 slot 用平台的，沒有用主題自己的 */}
{context.slots?.dock ? (
  <>{context.slots.dock as React.ReactNode}</>
) : (
  <ThemeBottomBar ... />
)}

{/* Tab 內容：依 activeTab 顯示 */}
{currentTab === 'space' ? (
  context.slots?.spaceEmbed ?? <p>空間預覽占位</p>
) : null}
```

### activeTab

有 `slots.dock` 時，tab 狀態由平台管理，主題透過 `context.activeTab` 取得目前分頁：

```tsx
const hasPlatformDock = !!context.slots?.dock
const currentTab = hasPlatformDock
  ? (context.activeTab ?? 'links')
  : localTab  // 本地預覽用內部狀態
```

---

## 主題入口

`app/theme-entry.tsx` 是打包的入口，必須 default export 一個 React 元件：

```tsx
import './globals.css'
import ThemeLoadingOrchestrator from '../components/ThemeLoadingOrchestrator'
import ThemePreviewLayout from '../components/ThemePreviewLayout'
import ThemeSkeleton from '../components/ThemeSkeleton'
import { ThemeSettingsSchema } from '../settings.schema'
import type { ThemeContext } from '../types'

export default function ThemeEntry({ context }: { context: ThemeContext }) {
  const result = ThemeSettingsSchema.safeParse(context.settings ?? {})
  const settings = result.success ? result.data : ThemeSettingsSchema.parse({})
  const ready = !!context.profile?.name

  return (
    <ThemeLoadingOrchestrator
      ready={ready}
      accentColor={settings.accentColor}
      logoUrl={context.profile?.avatarUrl}
      brandName={context.profile?.name}
    >
      {ready ? (
        <ThemePreviewLayout context={context} settings={settings} />
      ) : (
        <ThemeSkeleton />
      )}
    </ThemeLoadingOrchestrator>
  )
}
```

---

## 建置指令

| 指令 | 用途 | 產出 |
|------|------|------|
| `pnpm dev` | 本地開發預覽 | — |
| `pnpm build:esm` | 打包上傳用的主題檔案 | `dist/esm/` |
| `pnpm build` | Next.js 靜態匯出（管理員 HTML 預覽） | `out/` |

### 打包產出（`dist/esm/`）

```
dist/esm/
├── theme-entry.js       ← 主題元件（IIFE bundle）
├── style.css            ← 樣式
└── theme.publish.json   ← 主題清單
```

上傳時壓縮 `dist/esm/` **裡面的檔案**（不含 `esm/` 資料夾本身）。

---

## Mock 資料

`mock/` 目錄提供多組預設資料，用網址參數 `?mock=<key>` 切換：

- `context.full.json` — 完整品牌資料（`/?mock=full`，預設）
- `context.desktop-os.json` — macOS 風格桌面（`/?mock=desktop-os`）
- `context.minimal.json` — 最少資料（`/?mock=minimal`）
- `context.grid-layout.json` — 網格排版（`/?mock=grid-layout`）
- `context.split-layout.json` — 分欄排版（`/?mock=split-layout`）

---

## 桌面版設計（電腦版）

平台「首頁設計 → 桌面版設計」會把設定寫進
`context.settings.desktopLayout`（平台 runtime 隨 `...designSettings` 帶入）：

```ts
settings.desktopLayout = {
  mode: 'traditional' | 'os',   // os = macOS 風格桌面
  backgroundUrl: string | null, // 桌布；空則用模糊化 avatar
  apps: ThemeDesktopApp[],      // OS 模式 Dock App（最多 8）
}
```

- `mode==='os'`：`lg` 以上渲染桌布＋Dock＋可拖移／縮放視窗；
  `<lg`（手機）維持原本連結列表體驗。
- `mode` 未設定時 schema 預設 `traditional`，**行為與舊版完全一致**。
- 每個 App 依 `contentKind` 渲染：`tab`（內建 Hero／連結／Shop／會員／空間）、
  `embed`（iframe）、`rich`（HTML）；`module` / `experience` 為平台 runtime
  內容，本地預覽顯示占位。
- 視窗初始位置由 `windowAnchor`（9 宮格）＋ `windowSize` 經
  `lib/desktop-rect.ts` 換算，與平台公開頁一致。
- 本地預覽：`pnpm dev` 後開 `http://localhost:3000/?mock=desktop-os`。

> ⚠️ `desktopLayout` 是**使用者的版型選擇，不是主題視覺**。請勿寫進
> `examples/settings.sample.json`（會進 `theme.publish.json` 的
> `defaultSettings`，導致每次 refresh 蓋回使用者選擇）。

---

## CSS 動畫

`globals.css` 內建以下動畫 class，可直接使用：

| Class | 效果 |
|-------|------|
| `hl-skeleton` | 骨架屏 shimmer |
| `hl-stage-intro` | 開場淡入放大 |
| `hl-loader-pulse` | 載入中脈動 |
| `hl-progress-bar` | 進度條平滑過渡 |
| `hl-wipe-enter` | 轉場色塊滑入 |
| `hl-wipe-exit` | 轉場色塊滑出 |
| `hl-content-reveal` | 內容淡入上移 |
| `hl-brand-entry-fade` | 品牌進場淡入 |

---

## 注意事項

- `react` / `react-dom` 由平台提供，打包時會自動排除，不要移除依賴宣告
- 主題元件內不可使用 Next.js 專屬 API（`useRouter`、`next/link` 等），僅能用標準 React
- CSS 使用 Tailwind CSS，在 `globals.css` 中引入
- `settings.schema.ts` 中所有欄位應有 `.default()` 預設值，確保 safeParse 不會失敗
- 載入動畫時間可在 `ThemeLoadingOrchestrator.tsx` 頂部常數調整
