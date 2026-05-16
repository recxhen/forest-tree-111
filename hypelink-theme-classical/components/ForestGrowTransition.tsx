import ForestTreeLayers from './forest/ForestTreeLayers'

/**
 * Stage 3：森林由地面向上生長，繁茂後淡出，露出品牌頁。
 * 動畫時長需與 globals.css 的 `--hl-forest-duration` 及
 * ThemeLoadingOrchestrator 的 FOREST_DURATION 一致。
 */
export default function ForestGrowTransition() {
  return (
    <div
      className="hl-forest-scene fixed inset-0 z-50 overflow-hidden"
      aria-hidden
    >
      <div className="hl-forest-sky pointer-events-none absolute inset-0" />
      <ForestTreeLayers
        size="full"
        hillsClass="hl-forest-hills"
        layer3Class="hl-tree-layer-3"
        layer2Class="hl-tree-layer-2"
        layer1Class="hl-tree-layer-1"
        groundClass="hl-forest-ground"
      />
    </div>
  )
}
