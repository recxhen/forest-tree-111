'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import DesktopAppContent from './DesktopAppContent'
import DesktopAppWindow from './DesktopAppWindow'
import DesktopDock from './DesktopDock'
import { resolveDesktopAppRect } from '../../lib/desktop-rect'
import type { ThemeDesktopApp, ThemeSettings } from '../../settings.schema'
import type { ThemeContext } from '../../types'

/** OS 模式桌布：優先用設定的 backgroundUrl，否則模糊化 avatar，再否則漸層 */
function Backdrop({
  backgroundUrl,
  avatarUrl,
}: {
  backgroundUrl: string | null
  avatarUrl?: string
}) {
  const src = backgroundUrl ?? avatarUrl ?? null
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {src ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt=""
            className="absolute inset-0 h-full w-full scale-110 object-cover"
            style={{ filter: 'blur(36px) saturate(120%)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/25 to-black/45" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1F1147] via-[#5B21B6] to-[#7c3aed]" />
      )}
    </div>
  )
}

function StatusBar() {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    const update = () => setNow(new Date())
    update()
    const id = window.setInterval(update, 30_000)
    return () => window.clearInterval(id)
  }, [])
  const time = now
    ? now.toLocaleTimeString('zh-TW', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
      })
    : '--:--'
  const date = now
    ? now.toLocaleDateString('zh-TW', {
        month: 'short',
        day: 'numeric',
        weekday: 'short',
      })
    : ''
  return (
    <div className="absolute inset-x-0 top-0 z-20 flex h-7 items-center justify-end gap-3 px-5 text-[12px] font-medium text-white/85">
      <span className="tabular-nums" suppressHydrationWarning>
        {date}
      </span>
      <span className="font-semibold tabular-nums" suppressHydrationWarning>
        {time}
      </span>
    </div>
  )
}

/**
 * 桌面 OS 模式（lg 以上）。鏡射平台公開頁
 * （`hypelink/src/app/[hypeId]/PublicHypeLinkClient.tsx`）的桌布 + 視窗 + Dock
 * 互動，供主題作者本地預覽。手機（<lg）仍由 ThemePreviewLayout 走傳統列表。
 */
export default function DesktopOsLayout({
  context,
  settings,
  primary,
}: {
  context: ThemeContext
  settings: ThemeSettings
  primary: string
}) {
  const desktop = settings.desktopLayout
  const apps = useMemo(
    () => (desktop.apps ?? []).slice(0, 8),
    [desktop.apps],
  )

  const [openMap, setOpenMap] = useState<Record<string, boolean>>(() => {
    const m: Record<string, boolean> = {}
    for (const a of apps) {
      if (!a.href) m[a.id] = a.defaultOpen ?? false
    }
    return m
  })

  const containerRef = useRef<HTMLDivElement | null>(null)
  const [size, setSize] = useState({ w: 1280, h: 720 })
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect()
      setSize({ w: r.width, h: r.height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  function handleAppClick(app: ThemeDesktopApp) {
    if (app.href) {
      window.open(app.href, '_blank', 'noopener,noreferrer')
      return
    }
    setOpenMap((m) => ({ ...m, [app.id]: !(m[app.id] ?? false) }))
  }

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden"
    >
      <Backdrop
        backgroundUrl={desktop.backgroundUrl ?? null}
        avatarUrl={context.profile.avatarUrl}
      />
      <StatusBar />

      {/* App 視窗層 */}
      <div className="absolute inset-0 z-10">
        {apps.map((a) => {
          if (a.href) return null
          if (!(openMap[a.id] ?? false)) return null
          const rect = resolveDesktopAppRect(
            size,
            a.windowAnchor,
            a.windowSize,
          )
          return (
            <DesktopAppWindow
              key={a.id}
              title={a.label}
              rect={rect}
              container={size}
              chrome={a.tab === 'hero' ? 'phone' : 'mac'}
              onClose={() =>
                setOpenMap((m) => ({ ...m, [a.id]: false }))
              }
            >
              <DesktopAppContent
                app={a}
                context={context}
                settings={settings}
                primary={primary}
              />
            </DesktopAppWindow>
          )
        })}
      </div>

      <DesktopDock
        apps={apps}
        openMap={openMap}
        onAppClick={handleAppClick}
      />
    </div>
  )
}
