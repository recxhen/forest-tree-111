import { z } from 'zod'

/**
 * 底部浮動導覽列（對齊公開頁 `PublicBrandFloatingDock` 可調項目）。
 * 平台 runtime 若未讀取此欄位，可忽略；模板預覽與 publish `defaultSettings` 應帶齊預設。
 */
export const ThemeBottomBarSchema = z.object({
  enabled: z.boolean().default(true),
  /** `mobile-only`：僅 lg 以下顯示（同公開頁手機底欄）；`always`：含桌面（本地預覽較直覺） */
  visibility: z.enum(['always', 'mobile-only']).default('always'),
  showFavorite: z.boolean().default(true),
  showLinkSpaceToggle: z.boolean().default(true),
  showShopTab: z.boolean().default(true),
  showMemberTab: z.boolean().default(true),
  maxWidthPx: z.number().int().min(280).max(480).default(380),
  /** 底欄底色（建議含 alpha） */
  background: z.string().default('rgba(255,255,255,0.45)'),
  borderColor: z.string().default('rgba(255,255,255,0.6)'),
  borderRadiusPx: z.number().min(8).max(28).default(16),
  boxShadow: z.string().default('0 8px 32px rgba(15,23,42,0.08)'),
  backdropBlurPx: z.number().min(0).max(40).default(16),
  labelInactiveColor: z.string().default('#9ca3af'),
  /** 未填則使用 `accentColor` */
  labelActiveColor: z.string().optional(),
  /** Link/Space 開關在「開」時的軌道色；未填則使用 `accentColor` */
  switchCheckedBackground: z.string().optional(),
  iconInactiveColor: z.string().default('#9ca3af'),
  iconActiveBackground: z.string().default('#f5f3ff'),
  /** 未填則使用 `accentColor` */
  iconActiveColor: z.string().optional(),
  heartFavoriteBorder: z.string().default('#fda4af'),
  heartFavoriteBg: z.string().default('#fff1f2'),
  heartFavoriteIcon: z.string().default('#e11d48'),
  heartDefaultBorder: z.string().default('#e5e7eb'),
  heartDefaultBg: z.string().default('rgba(255,255,255,0.8)'),
  heartDefaultIcon: z.string().default('#71717a'),
})

export type ThemeBottomBarSettings = z.infer<typeof ThemeBottomBarSchema>

/** 連結區頂部「資料夾／分頁」列（對齊公開頁 `PublicHypeLinkClient` 資料夾 tab） */
export const ThemeFolderTabsSchema = z.object({
  /** Tab 列底色（可含 alpha） */
  barBackground: z.string().default('rgba(255,255,255,0.7)'),
  barBorderColor: z.string().default('#e5e7eb'),
  barBackdropBlurPx: z.number().min(0).max(24).default(8),
  inactiveColor: z.string().default('#9ca3af'),
  inactiveHoverColor: z.string().default('#71717a'),
  /** 未填則使用 `accentColor` */
  activeTextColor: z.string().optional(),
  /** 未填則使用 `accentColor`（底線） */
  activeIndicatorColor: z.string().optional(),
})

export type ThemeFolderTabsSettings = z.infer<typeof ThemeFolderTabsSchema>

/**
 * 桌面版（lg 以上）排版設定。對齊前端 `BrandDesktopLayout`
 * （`hypelink/src/lib/brand-design-types.ts`）— 由「首頁設計 > 桌面版設計」產出，
 * 平台透過 `theme-render-props-builder.ts` 的 `...designSettings` 帶進 `settings.desktopLayout`。
 *
 * 注意：`mode` 是「使用者的版型選擇」，不是主題視覺。請勿把 `desktopLayout`
 * 寫進 `examples/settings.sample.json`（會進 publish `defaultSettings`，每次
 * refresh 蓋回使用者選擇）。schema 預設 `traditional` 確保未設定時行為不變。
 */
export const DESKTOP_APP_ICONS = [
  'phone',
  'briefcase',
  'file-text',
  'user',
  'calendar',
  'shopping-bag',
  'heart',
  'sparkles',
] as const

export const DESKTOP_APP_ANCHORS = [
  'top-left',
  'top',
  'top-right',
  'left',
  'center',
  'right',
  'bottom-left',
  'bottom',
  'bottom-right',
] as const

export const DESKTOP_APP_SIZES = ['small', 'medium', 'large', 'full'] as const

export const ThemeDesktopAppSchema = z.object({
  id: z.string(),
  label: z.string().default('App'),
  icon: z.enum(DESKTOP_APP_ICONS).default('sparkles'),
  /** 點擊：開啟外部連結 */
  href: z.string().optional(),
  /** 點擊：切到內建分頁（hero=基本資訊；links=連結；shop/member/space） */
  tab: z.enum(['hero', 'links', 'shop', 'member', 'space']).optional(),
  /** 內容類型：tab=內建分頁；embed=iframe；rich=HTML；module/experience=平台內容 */
  contentKind: z
    .enum(['tab', 'embed', 'rich', 'module', 'experience'])
    .optional(),
  embedUrl: z.string().optional(),
  richContent: z.string().optional(),
  moduleInstanceId: z.string().optional(),
  experienceSlug: z.string().optional(),
  /** OS 模式視窗預設停靠位置（9 宮格錨點） */
  windowAnchor: z.enum(DESKTOP_APP_ANCHORS).default('top-left'),
  /** OS 模式視窗預設大小 */
  windowSize: z.enum(DESKTOP_APP_SIZES).default('medium'),
  /** 頁面載入時是否預設開啟視窗 */
  defaultOpen: z.boolean().default(false),
})

export type ThemeDesktopApp = z.infer<typeof ThemeDesktopAppSchema>

export const ThemeDesktopLayoutSchema = z.object({
  /** `traditional`：左欄品牌＋右欄連結（與手機一致放大）；`os`：macOS 風格桌面 */
  mode: z.enum(['traditional', 'os']).default('traditional'),
  /** OS 模式桌布；為空則用模糊化 avatar */
  backgroundUrl: z.string().nullable().default(null),
  apps: z.array(ThemeDesktopAppSchema).default([]),
})

export type ThemeDesktopLayoutSettings = z.infer<
  typeof ThemeDesktopLayoutSchema
>

export const ThemeSettingsSchema = z.object({
  layout: z.enum(['stack', 'grid', 'split']).default('stack'),
  accentColor: z.string().default('#7B61FF'),
  backgroundColor: z.string().default('#fafafa'),
  showBio: z.boolean().default(true),
  cardRadius: z.number().min(0).max(40).default(16),
  bottomBar: ThemeBottomBarSchema.default({}),
  folderTabs: ThemeFolderTabsSchema.default({}),
  /** 桌面版排版（lg 以上）；未設定時 = traditional（行為不變） */
  desktopLayout: ThemeDesktopLayoutSchema.default({}),
})

export type ThemeSettings = z.infer<typeof ThemeSettingsSchema>
