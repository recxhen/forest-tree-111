import { isForestCornerSection } from './forest-corner-sections'
import type { FolderItem } from '../types'

export type SectionLayout = 'default' | 'stats'
export type CardLayout = 'link' | 'fundraising'

const FUNDRAISING_TITLE_HINTS = [
  '珊瑚礁緊急募款',
  '珊瑚礁復育緊急募款',
  '山林復育行動基金',
  '海洋廢棄物行動計劃',
  '海洋廢棄物清除計畫',
] as const

function normTitle(title: string | undefined): string {
  return (title ?? '').trim().replace(/\s+/g, ' ')
}

function hasTag(item: FolderItem, tag: string): boolean {
  return Array.isArray(item.tags) && item.tags.includes(tag)
}

/**
 * 分頁是否顯示右下角森林。
 * 優先：metadata.forestCorner → tag `forest-corner` → 舊版標題白名單（平台常不帶 metadata）。
 */
export function resolveForestCorner(
  item: FolderItem,
  sectionTitle?: string,
): boolean {
  const meta = item.metadata
  if (meta?.forestCorner === true) return true
  if (meta?.forestCorner === false) return false
  if (hasTag(item, 'forest-corner')) return true
  return isForestCornerSection(normTitle(sectionTitle ?? item.title))
}

/**
 * 分頁版面：成就統計卡 vs 一般連結 grid。
 */
export function resolveSectionLayout(
  item: FolderItem,
  sectionTitle?: string,
): SectionLayout {
  const meta = item.metadata
  if (meta?.sectionLayout === 'stats') return 'stats'
  if (meta?.sectionLayout === 'default') return 'default'
  if (hasTag(item, 'section-stats')) return 'stats'
  if (normTitle(sectionTitle ?? item.title) === '我們的成就') return 'stats'
  return 'default'
}

/**
 * 連結卡片：募款進度條 vs 一般卡片。
 */
export function resolveCardLayout(item: FolderItem): CardLayout {
  const meta = item.metadata
  if (meta?.cardLayout === 'fundraising') return 'fundraising'
  if (meta?.cardLayout === 'link') return 'link'
  if (hasTag(item, 'fundraising')) return 'fundraising'
  const title = normTitle(item.title)
  if (FUNDRAISING_TITLE_HINTS.some((hint) => title.includes(hint))) {
    return 'fundraising'
  }
  return 'link'
}
