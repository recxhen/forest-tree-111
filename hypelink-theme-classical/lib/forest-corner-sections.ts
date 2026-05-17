/**
 * 舊版分頁標題白名單（向後相容 mock）。
 * 平台請改在分頁資料夾設 `metadata.forestCorner: true` 或 tag `forest-corner`。
 */
export const FOREST_CORNER_SECTION_TITLES = [
  '緊急募款',
  '志工招募',
  '現行專案',
  '我們的成就',
  '最新消息',
  '環境教育資源',
] as const

export type ForestCornerSectionTitle =
  (typeof FOREST_CORNER_SECTION_TITLES)[number]

export function isForestCornerSection(title: string | undefined): boolean {
  if (!title) return false
  return (FOREST_CORNER_SECTION_TITLES as readonly string[]).includes(title)
}
