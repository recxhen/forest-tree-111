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

      <svg
        className="hl-forest-hills pointer-events-none absolute bottom-0 left-0 w-full"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M0,120 C200,40 400,160 600,90 C800,20 1000,140 1200,70 C1320,30 1380,50 1440,80 L1440,200 L0,200 Z"
          fill="#2d4538"
          opacity="0.55"
        />
      </svg>

      <svg
        className="hl-tree-layer-3 pointer-events-none absolute bottom-0 left-0 w-[110%] -translate-x-[5%]"
        style={{ height: '52vh' }}
        viewBox="0 0 1440 420"
        preserveAspectRatio="xMidYMax slice"
        aria-hidden
      >
        <g fill="#2a4236" opacity="0.85">
          <path d="M80,420 L120,180 L160,420 Z" />
          <path d="M200,420 L255,120 L310,420 Z" />
          <path d="M340,420 L390,200 L440,420 Z" />
          <path d="M500,420 L560,90 L620,420 Z" />
          <path d="M660,420 L710,160 L760,420 Z" />
          <path d="M820,420 L880,110 L940,420 Z" />
          <path d="M980,420 L1030,190 L1080,420 Z" />
          <path d="M1120,420 L1175,130 L1230,420 Z" />
          <path d="M1260,420 L1310,210 L1360,420 Z" />
        </g>
      </svg>

      <svg
        className="hl-tree-layer-2 pointer-events-none absolute bottom-0 left-0 w-[115%] -translate-x-[7%]"
        style={{ height: '68vh' }}
        viewBox="0 0 1440 520"
        preserveAspectRatio="xMidYMax slice"
        aria-hidden
      >
        <g fill="#3a533d">
          <path d="M40,520 L95,200 L150,520 Z" />
          <path d="M170,520 L240,80 L310,520 Z" />
          <path d="M330,520 L395,150 L460,520 Z" />
          <path d="M480,520 L555,60 L630,520 Z" />
          <path d="M650,520 L720,140 L790,520 Z" />
          <path d="M810,520 L885,70 L960,520 Z" />
          <path d="M990,520 L1060,180 L1130,520 Z" />
          <path d="M1150,520 L1225,100 L1300,520 Z" />
          <path d="M1320,520 L1390,220 L1460,520 Z" />
        </g>
      </svg>

      <svg
        className="hl-tree-layer-1 pointer-events-none absolute bottom-0 left-0 w-full"
        style={{ height: '78vh' }}
        viewBox="0 0 1440 600"
        preserveAspectRatio="xMidYMax slice"
        aria-hidden
      >
        <g fill="#1b2e24">
          <path d="M-20,600 L60,220 L140,600 Z" />
          <path d="M120,600 L210,40 L300,600 Z" />
          <path d="M380,600 L470,180 L560,600 Z" />
          <path d="M620,600 L720,0 L820,600 Z" />
          <path d="M880,600 L975,150 L1070,600 Z" />
          <path d="M1140,600 L1235,90 L1330,600 Z" />
          <path d="M1380,600 L1460,260 L1540,600 Z" />
        </g>
      </svg>

      <div className="hl-forest-ground pointer-events-none absolute inset-x-0 bottom-0 h-[18vh]" aria-hidden />
    </div>
  )
}
