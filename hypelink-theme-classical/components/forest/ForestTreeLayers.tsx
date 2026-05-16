/**
 * 與 Stage 3 轉場相同的分層樹木 SVG，可全螢幕或右下角縮放使用。
 */
export default function ForestTreeLayers({
  layer1Class,
  layer2Class,
  layer3Class,
  hillsClass,
  groundClass,
  size = 'full',
}: {
  layer1Class: string
  layer2Class: string
  layer3Class: string
  hillsClass?: string
  groundClass?: string
  size?: 'full' | 'corner'
}) {
  const isCorner = size === 'corner'
  const layerHeights = isCorner
    ? { l3: '24vh', l2: '30vh', l1: '38vh' }
    : { l3: '52vh', l2: '68vh', l1: '78vh' }

  return (
    <>
      {!isCorner && hillsClass ? (
        <svg
          className={`${hillsClass} pointer-events-none absolute bottom-0 left-0 w-full`}
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
      ) : null}

      <svg
        className={`${layer3Class} pointer-events-none absolute bottom-0 ${isCorner ? 'right-0 w-[85%]' : 'left-0 w-[110%] -translate-x-[5%]'}`}
        style={{ height: layerHeights.l3 }}
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
        className={`${layer2Class} pointer-events-none absolute bottom-0 ${isCorner ? 'right-0 w-[92%]' : 'left-0 w-[115%] -translate-x-[7%]'}`}
        style={{ height: layerHeights.l2 }}
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
        className={`${layer1Class} pointer-events-none absolute bottom-0 ${isCorner ? 'right-0 w-full max-w-[min(100%,420px)]' : 'left-0 w-full'}`}
        style={{ height: layerHeights.l1 }}
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
        {!isCorner ? (
          <g fill="#788a6b" opacity="0.35">
            <ellipse cx="720" cy="120" rx="280" ry="70" />
          </g>
        ) : (
          <g fill="#788a6b" opacity="0.28">
            <ellipse cx="1100" cy="140" rx="200" ry="55" />
          </g>
        )}
      </svg>

      {/* {groundClass ? (
        <div
          className={`${groundClass} pointer-events-none absolute bottom-0 ${isCorner ? 'right-0 left-auto w-[70%] h-[8vh]' : 'inset-x-0 h-[18vh]'}`}
          aria-hidden
        />
      ) : null} */}
    </>
  )
}
