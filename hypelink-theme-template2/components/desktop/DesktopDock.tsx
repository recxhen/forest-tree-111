'use client'

import { iconForApp } from '../../lib/desktop-icon'
import type { ThemeDesktopApp } from '../../settings.schema'

/** 底部 macOS 風格 Dock；點擊切換視窗開關或開啟外部連結 */
export default function DesktopDock({
  apps,
  openMap,
  onAppClick,
}: {
  apps: ThemeDesktopApp[]
  openMap: Record<string, boolean>
  onAppClick: (app: ThemeDesktopApp) => void
}) {
  if (apps.length === 0) return null
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-30 hidden justify-center lg:flex">
      <div className="pointer-events-auto flex items-end gap-3 rounded-3xl border border-white/30 bg-white/20 px-4 pb-3 pt-2 shadow-[0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
        {apps.slice(0, 8).map((a) => {
          const Icon = iconForApp(a)
          const open = openMap[a.id] ?? false
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => onAppClick(a)}
              title={a.label}
              className="group relative flex flex-col items-center gap-1 pb-2 transition-transform hover:-translate-y-1 active:scale-95"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-white/95 to-white/70 text-[#1F1147] shadow-[0_8px_20px_rgba(0,0,0,0.3)]">
                <Icon className="h-6 w-6" />
              </span>
              <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
                {a.label}
              </span>
              <span
                className="pointer-events-none absolute bottom-0 h-[5px] w-[5px] rounded-full bg-white transition-opacity"
                style={{ opacity: open ? 0.95 : 0 }}
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}
