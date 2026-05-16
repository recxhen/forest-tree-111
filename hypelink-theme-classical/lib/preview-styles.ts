/** 與公開頁 `cardRadiusClass` 在 `cornerRadius: large` 時一致 */
export function linkCardRadiusClass(cardRadius: number): string {
  if (cardRadius <= 0) return 'rounded-none'
  if (cardRadius < 10) return 'rounded-lg'
  if (cardRadius >= 20) return 'rounded-[22px]'
  return 'rounded-[14px]'
}

/** 古典主題：墨色標題／赭石調內文 */
export const PREVIEW_HEADING_TONE = '#2a2319'
export const PREVIEW_MUTED_TONE = '#5e5648'
