/** 進入這些分頁標題時，右下角長出森林裝飾（與 mock 資料夾標題對齊） */
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
