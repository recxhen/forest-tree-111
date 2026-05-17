import { isForestCornerSection } from './forest-corner-sections'
import type { FolderItem } from '../types'

/** 連結分頁版面（由分頁資料夾的 metadata / tags 決定） */
export type SectionLayout = 'default' | 'stats'

/** 單一連結卡片版面 */
export type CardLayout = 'link' | 'fundraising'

const LEGACY_STATS_SECTION_TITLE = '我們的成就'

/** @deprecated 僅向後相容 mock；請改用 metadata.cardLayout 或 tags */
const LEGACY_FUNDRAISING_TITLE_FRAGMENTS = [
  '珊瑚礁緊急募款',
  '珊瑚礁復育緊急募款',
  '山林復育行動基金',
  '海洋廢棄物行動計劃',
  '海洋廢棄物清除計畫',
] as const

function hasTag(item: FolderItem | undefined, tag: string): boolean {
  return item?.tags?.includes(tag) ?? false
}

function metaString(
  item: FolderItem | undefined,
  key: string,
): string | undefined {
  const v = item?.metadata?.[key]
  return typeof v === 'string' ? v : undefined
}

/**
 * 分頁版面。優先序：
 * 1. 分頁資料夾 `metadata.sectionLayout === "stats"`
 * 2. 分頁資料夾 `tags` 含 `section-stats`
 * 3. 舊版 mock 標題「我們的成就」
 */
export function resolveSectionLayout(
  header: FolderItem | undefined,
  sectionTitle: string,
): SectionLayout {
  if (metaString(header, 'sectionLayout') === 'stats') return 'stats'
  if (hasTag(header, 'section-stats')) return 'stats'
  if (sectionTitle === LEGACY_STATS_SECTION_TITLE) return 'stats'
  return 'default'
}

/**
 * 是否顯示右下角森林裝飾。優先序：
 * 1. `metadata.forestCorner === true`
 * 2. `tags` 含 `forest-corner`
 * 3. 舊版標題白名單（forest-corner-sections）
 */
export function resolveForestCorner(
  header: FolderItem | undefined,
  sectionTitle: string,
): boolean {
  if (header?.metadata?.forestCorner === true) return true
  if (hasTag(header, 'forest-corner')) return true
  return isForestCornerSection(sectionTitle)
}

/**
 * 連結卡片版面。優先序：
 * 1. `metadata.cardLayout === "fundraising"`
 * 2. `tags` 含 `fundraising`
 * 3. 同時有 `metadata.currentAmount` 與 `targetAmount`
 * 4. 舊版標題片段白名單
 */
export function resolveCardLayout(item: FolderItem): CardLayout {
  if (metaString(item, 'cardLayout') === 'fundraising') return 'fundraising'
  if (hasTag(item, 'fundraising')) return 'fundraising'
  const meta = item.metadata
  if (
    typeof meta?.currentAmount === 'number' &&
    typeof meta?.targetAmount === 'number'
  ) {
    return 'fundraising'
  }
  if (
    LEGACY_FUNDRAISING_TITLE_FRAGMENTS.some((t) => item.title.includes(t))
  ) {
    return 'fundraising'
  }
  return 'link'
}
