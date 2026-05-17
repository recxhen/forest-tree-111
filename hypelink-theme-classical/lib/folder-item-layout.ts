import { isForestCornerSection } from './forest-corner-sections'
import type { FolderItem } from '../types'

export type SectionLayout = 'default' | 'stats'
export type CardLayout = 'fundraising' | 'link'

/** 示範主題中預設為 stats 版面的分頁序（0-based，對應 mock 第 4 個分頁） */
const STATS_SECTION_INDEX = 3

/** 示範主題中預設顯示森林裝飾的分頁數（0..N-1） */
const FOREST_CORNER_SECTION_COUNT = 6

function hasTag(item: FolderItem, tag: string): boolean {
  return item.tags?.includes(tag) ?? false
}

function normalizeTitle(title: string | undefined): string {
  return title?.trim() ?? ''
}

/**
 * 分頁是否顯示右下角森林裝飾。
 * 優先：metadata → tag → 分頁順序（外部資料改標題仍有效）→ 舊版標題白名單。
 */
export function resolveForestCorner(item: FolderItem, sectionIndex: number): boolean {
  const meta = item.metadata?.forestCorner
  if (meta === true) return true
  if (meta === false) return false
  if (hasTag(item, 'forest-corner')) return true
  if (sectionIndex >= 0 && sectionIndex < FOREST_CORNER_SECTION_COUNT) return true
  return isForestCornerSection(normalizeTitle(item.title))
}

/**
 * 分頁版面：stats（成就統計卡）或 default（連結網格）。
 * 優先：metadata → tag → 分頁順序 → 子項目是否含 stat 欄位。
 */
export function resolveSectionLayout(
  item: FolderItem,
  sectionIndex: number,
  sectionItems: FolderItem[] = [],
): SectionLayout {
  if (item.metadata?.sectionLayout === 'stats') return 'stats'
  if (hasTag(item, 'section-stats')) return 'stats'
  if (sectionIndex === STATS_SECTION_INDEX) return 'stats'
  if (
    sectionItems.some(
      (i) =>
        typeof i.metadata?.statValue === 'number' ||
        hasTag(i, 'achievement'),
    )
  ) {
    return 'stats'
  }
  return 'default'
}

/** 連結卡片版面：募款進度條或一般連結卡 */
export function resolveCardLayout(item: FolderItem): CardLayout {
  if (item.metadata?.cardLayout === 'fundraising') return 'fundraising'
  if (item.metadata?.cardLayout === 'link') return 'link'
  if (hasTag(item, 'fundraising')) return 'fundraising'
  if (
    typeof item.metadata?.currentAmount === 'number' &&
    typeof item.metadata?.targetAmount === 'number'
  ) {
    return 'fundraising'
  }
  return 'link'
}
