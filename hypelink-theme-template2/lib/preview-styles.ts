/** 與公開頁 `cardRadiusClass` 在 `cornerRadius: large` 時一致 */
export function linkCardRadiusClass(cardRadius: number): string {
  if (cardRadius <= 0) return 'rounded-none'
  if (cardRadius < 10) return 'rounded-lg'
  if (cardRadius >= 20) return 'rounded-[22px]'
  return 'rounded-[14px]'
}

/** 內建 `builtin-original` 的標題／內文色調 */
export const PREVIEW_HEADING_TONE = '#1a1a2e'
export const PREVIEW_MUTED_TONE = '#555555'
