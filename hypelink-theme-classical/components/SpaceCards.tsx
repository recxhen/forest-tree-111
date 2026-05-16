import type { SpaceLink } from '../types'

const kindLabel: Record<SpaceLink['kind'], string> = {
  '3d-space': '3D 空間',
  'virtual-store': '商店',
  'event-room': '活動',
  gallery: '展廊',
  external: '外部',
}

export default function SpaceCards({
  items,
  linkCardRadiusClass: radiusCls,
  spaceGap,
}: {
  items: SpaceLink[]
  linkCardRadiusClass: string
  spaceGap: number
}) {
  if (!items.length) return null

  return (
    <div
      className="mx-auto w-full max-w-5xl px-4 pb-8 pt-2 lg:px-10"
      style={{ gap: `${Math.max(12, spaceGap * 1.25)}px` }}
    >
      <h2 className="mb-3 text-center text-sm font-semibold text-[#71717a]">
        Space
      </h2>
      <div
        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
        style={{ gap: `${Math.max(10, spaceGap * 1.1)}px` }}
      >
        {items.map((item) => (
          <a
            key={item.id}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`block overflow-hidden border border-[#e5e7eb] bg-white/95 shadow-sm backdrop-blur-sm ${radiusCls}`}
          >
            {item.previewImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.previewImage}
                alt=""
                className="aspect-[2/1] w-full object-cover"
              />
            ) : (
              <div className="flex aspect-[2/1] w-full items-center justify-center bg-gradient-to-br from-[#f4f4f5] to-[#e4e4e7] text-xs text-[#9ca3af]">
                無預覽圖
              </div>
            )}
            <div className="px-4 py-3">
              <p className="text-[13px] font-semibold text-[#18181b]">
                {item.name}
              </p>
              <p className="mt-1 text-xs text-[#71717a]">
                {kindLabel[item.kind] ?? item.kind}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
