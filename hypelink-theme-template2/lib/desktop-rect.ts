/**
 * 桌面版 OS 模式視窗座標計算 — 移植自前端
 * `hypelink/src/lib/brand-design-types.ts` 的 `resolveBrandDesktopAppRect()`，
 * 保持與平台公開頁相同的錨點/大小換算，確保本地預覽與線上一致。
 */
import type {
  DESKTOP_APP_ANCHORS,
  DESKTOP_APP_SIZES,
} from '../settings.schema'

export type DesktopAppAnchor = (typeof DESKTOP_APP_ANCHORS)[number]
export type DesktopAppSize = (typeof DESKTOP_APP_SIZES)[number]

export type DesktopRect = { x: number; y: number; w: number; h: number }

/**
 * 將 anchor + size 轉為視窗在容器內的 px 座標。
 * @param container 工作區寬高（lg 桌面 OS 模式）
 * @param anchor 9 宮格錨點
 * @param size 視窗大小
 */
export function resolveDesktopAppRect(
  container: { w: number; h: number },
  anchor: DesktopAppAnchor = 'top-left',
  size: DesktopAppSize = 'medium',
): DesktopRect {
  const padding = 24
  let w: number
  let h: number
  if (size === 'full') {
    w = Math.max(320, container.w - padding * 2)
    h = Math.max(240, container.h - padding * 2)
  } else {
    const ratio = size === 'small' ? 0.32 : size === 'medium' ? 0.46 : 0.66
    w = Math.min(
      Math.max(320, Math.round(container.w * ratio)),
      container.w - padding * 2,
    )
    h = Math.min(
      Math.max(
        280,
        Math.round(
          container.h *
            (size === 'small' ? 0.5 : size === 'medium' ? 0.7 : 0.85),
        ),
      ),
      container.h - padding * 2,
    )
  }
  let x: number
  let y: number
  if (anchor.startsWith('top')) y = padding
  else if (anchor.startsWith('bottom')) y = container.h - padding - h
  else y = Math.round((container.h - h) / 2)
  if (anchor.endsWith('left')) x = padding
  else if (anchor.endsWith('right')) x = container.w - padding - w
  else x = Math.round((container.w - w) / 2)
  return { x, y, w, h }
}
