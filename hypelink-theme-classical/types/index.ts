import type {
  ThemeSettings,
  ThemeDesktopLayoutSettings,
  ThemeDesktopApp,
} from '../settings.schema'

export type ThemeCapability =
  | 'profile'
  | 'social-links'
  | 'folder-items'
  | 'space-links'
  | 'theme-settings'

export type ThemeConfig = {
  id: string
  name: string
  version: string
  author: string
  description: string
  entry: string
  previewImage: string
  capabilities: ThemeCapability[]
  platform: {
    minVersion: string
  }
}

export type UserProfile = {
  id: string
  slug: string
  name: string
  headline?: string
  avatarUrl?: string
  coverUrl?: string
  /** 品牌自訂 Logo URL（替換品牌頁左上角 HypeLink Logo） */
  brandLogoUrl?: string
  bio?: string
  /** 與公開頁 `profile.description` 對齊；缺省時可退回 `bio` */
  description?: string
  locale: string
  verified: boolean
}

export type SocialLink = {
  id: string
  type: string
  label: string
  url: string
  icon?: string
  order: number
  isVisible: boolean
}

export type FolderItem = {
  id: string
  title: string
  description?: string
  type: 'link' | 'file' | 'folder' | 'post' | 'product' | 'event' | 'space' | 'page-module'
  coverImage?: string
  href?: string
  childrenCount?: number
  tags: string[]
  /** 平台預渲染的模組內容（type="page-module" 時由平台注入） */
  moduleSlot?: unknown
  /** 模組版面大小："full"=佔滿整行, "half"=佔半行 */
  moduleLayout?: 'full' | 'half'
  /**
   * 點擊行為（v2 主題支援）：
   * - "external"（預設）：以 href 開新分頁
   * - "embed"：保留語意（平台側目前以新分頁處理）
   * - "expand-text"：點擊不跳轉，於下方展開 expandHtml 富文字
   */
  clickBehavior?: 'external' | 'embed' | 'expand-text'
  /** clickBehavior="expand-text" 時的 HTML 內容（平台 sanitize 後注入） */
  expandHtml?: string
  /** 募款進度等擴充資料 */
  metadata?: {
    currentAmount?: number
    targetAmount?: number
    [key: string]: unknown
  }
}

export type SpaceLink = {
  id: string
  name: string
  href: string
  previewImage?: string
  kind: '3d-space' | 'virtual-store' | 'event-room' | 'gallery' | 'external'
}

/**
 * 平台注入的功能區塊（React nodes）。
 * runtime 時由平台提供實際元件；本地預覽時為 undefined（主題顯示占位 UI）。
 */
export type ThemeSlots = {
  /** 頂部導覽列（Logo + 使用者選單） */
  header?: unknown
  /** 底部導覽列 — 手機版（水平 bar） */
  dockMobile?: unknown
  /** 底部導覽列 — 桌面版（2x2 grid） */
  dockDesktop?: unknown
  /** 3D 空間嵌入 */
  spaceEmbed?: unknown
  /** 會員中心 */
  memberTab?: unknown
  /** 商城 */
  shopTab?: unknown
  /** 會員 CTA（側欄：加入會員 / 品牌會員徽章 / 成為會員） */
  memberCta?: unknown
}

export type ThemeContext = {
  profile: UserProfile
  socialLinks: SocialLink[]
  folderItems: FolderItem[]
  spaceLinks: SpaceLink[]
  /**
   * 可自訂的設定。桌面版排版位於 `settings.desktopLayout`
   * （平台 runtime 由 `theme-render-props-builder` 的 `...designSettings`
   * 帶入；未設定時 schema 預設 `mode: 'traditional'`，行為不變）。
   */
  settings: Partial<ThemeSettings>
  /** 平台注入的功能區塊，主題可自由放置 */
  slots?: ThemeSlots
  /** 平台管理的目前分頁（有 slots.dock 時由平台控制） */
  activeTab?: 'links' | 'space' | 'shop' | 'member'
}

export type { ThemeSettings, ThemeDesktopLayoutSettings, ThemeDesktopApp }
