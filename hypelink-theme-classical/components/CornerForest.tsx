'use client'

import ForestTreeLayers from './forest/ForestTreeLayers'

/**
 * 右下角森林裝飾：生長完畢後永久停留（不淡出）。
 * 由父層以 key 切換分頁時重新播放生長動畫。
 */
export default function CornerForest() {
  return (
    <div
      className="hl-corner-forest pointer-events-none fixed z-0 h-[min(42vh,380px)] w-[min(52vw,420px)] overflow-hidden"
      style={{
        right: 'max(0px, env(safe-area-inset-right, 0px))',
        bottom: 'max(0px, env(safe-area-inset-bottom, 0px))',
      }}
      aria-hidden
    >
      <div className="hl-corner-forest-ground absolute inset-x-0 bottom-0 h-[10%]" />
      <ForestTreeLayers
        size="corner"
        layer3Class="hl-corner-tree-layer-3"
        layer2Class="hl-corner-tree-layer-2"
        layer1Class="hl-corner-tree-layer-1"
        groundClass="hl-corner-forest-soil"
      />
    </div>
  )
}
