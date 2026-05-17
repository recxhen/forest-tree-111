'use client'

import { useEffect, useRef, useState } from 'react'

import type { FolderItem } from '../types'

// ── Icon SVGs ────────────────────────────────────────────────────────────────

function IconWave() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
      <circle cx="18" cy="18" r="18" fill="rgba(74,154,184,0.15)" />
      <path d="M6 18 C9 14 12 22 15 18 C18 14 21 22 24 18 C27 14 30 22 30 18" stroke="#4a9ab8" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M6 22 C9 18 12 26 15 22 C18 18 21 26 24 22 C27 18 30 26 30 22" stroke="#4a9ab8" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.5"/>
    </svg>
  )
}

function IconTree() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
      <circle cx="18" cy="18" r="18" fill="rgba(74,122,82,0.15)" />
      <path d="M18 28 L18 18" stroke="#4a7a52" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M13 12 L18 4 L23 12 Z" fill="#4a7a52"/>
      <path d="M11 18 L18 9 L25 18 Z" fill="#6a9a5f"/>
      <path d="M9 23 L18 14 L27 23 Z" fill="#788a6b"/>
    </svg>
  )
}

function IconLaw() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
      <circle cx="18" cy="18" r="18" fill="rgba(166,124,0,0.12)" />
      <rect x="16" y="8" width="4" height="20" rx="2" fill="#a67c00" opacity="0.8"/>
      <rect x="10" y="12" width="16" height="2.5" rx="1.2" fill="#a67c00"/>
      <rect x="9" y="22" width="7" height="2.5" rx="1.2" fill="#a67c00" opacity="0.7"/>
      <rect x="20" y="22" width="7" height="2.5" rx="1.2" fill="#a67c00" opacity="0.7"/>
      <path d="M9 24.5 L16 24.5" stroke="#a67c00" strokeWidth="1" opacity="0.5"/>
      <path d="M20 24.5 L27 24.5" stroke="#a67c00" strokeWidth="1" opacity="0.5"/>
    </svg>
  )
}

function IconAward() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
      <circle cx="18" cy="18" r="18" fill="rgba(166,124,0,0.12)" />
      <circle cx="18" cy="16" r="7" stroke="#c4930a" strokeWidth="2" fill="none"/>
      <path d="M14 23 L12 30 L18 27 L24 30 L22 23" fill="#c4930a" opacity="0.75"/>
      <path d="M16 16 L17.5 12 L19 16 L23 16 L20 18.5 L21 22 L17.5 20 L14 22 L15 18.5 L12 16 Z" fill="#c4930a"/>
    </svg>
  )
}

const ICON_MAP: Record<string, React.ReactNode> = {
  wave: <IconWave />,
  tree: <IconTree />,
  law: <IconLaw />,
  award: <IconAward />,
}

// ── Count-up hook ────────────────────────────────────────────────────────────

function useCountUp(target: number, duration = 1800, started = false) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!started) return
    const start = performance.now()
    let raf: number

    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration, started])

  return value
}

// ── Format helpers ───────────────────────────────────────────────────────────

function formatStat(value: number, target: number): string {
  if (target >= 100000) {
    const wan = value / 10000
    return wan % 1 === 0 ? `${wan} 萬` : `${wan.toFixed(1)} 萬`
  }
  return value.toLocaleString()
}

// ── Single card ──────────────────────────────────────────────────────────────

function StatCard({
  item,
  radiusCls,
  started,
}: {
  item: FolderItem
  radiusCls: string
  started: boolean
}) {
  const meta = item.metadata ?? {}
  const target = (meta.statValue as number) ?? 0
  const unit = (meta.statUnit as string) ?? ''
  const label = (meta.statLabel as string) ?? item.title
  const icon = (meta.statIcon as string) ?? 'tree'

  const count = useCountUp(target, 1800, started)

  const inner = (
    <div
      className={`group flex h-full flex-col items-center justify-center gap-3 border border-hl-border/70 bg-hl-parchment-elevated px-5 py-6 shadow-sm transition-shadow hover:shadow-md ${radiusCls}`}
    >
      <div className="transition-transform duration-300 group-hover:scale-110">
        {ICON_MAP[icon] ?? ICON_MAP.tree}
      </div>

      <div className="text-center">
        <p className="font-mono text-3xl font-bold leading-none tracking-tight text-hl-ink lg:text-4xl">
          {formatStat(count, target)}
          <span className="ml-1 text-lg font-semibold text-hl-muted">{unit}</span>
        </p>
        <p className="mt-1.5 text-[11px] font-medium uppercase tracking-widest text-hl-muted">
          {label}
        </p>
      </div>

      <p className="line-clamp-2 text-center text-[11px] leading-relaxed text-hl-muted/80">
        {item.description}
      </p>
    </div>
  )

  if (item.href) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full"
      >
        {inner}
      </a>
    )
  }
  return <div className="h-full">{inner}</div>
}

// ── Grid ─────────────────────────────────────────────────────────────────────

export default function AchievementStatCards({
  items,
  radiusCls,
  spaceGap,
}: {
  items: FolderItem[]
  radiusCls: string
  spaceGap: number
}) {
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect() } },
      { threshold: 0.2 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="grid grid-cols-2"
      style={{ gap: `${Math.max(10, spaceGap * 1.25)}px` }}
    >
      {items.map((item) => (
        <StatCard key={item.id} item={item} radiusCls={radiusCls} started={started} />
      ))}
    </div>
  )
}
