'use client'

import { useCallback, useRef } from 'react'

import type { ThemeSettings, UserProfile } from '../types'

// ── Leaf burst canvas animation ──────────────────────────────────────────────

const LEAF_COLORS = ['#788a6b', '#9ab87a', '#4a7a52', '#b5cc8e', '#3d6e45']

type Particle = {
  x: number; y: number
  vx: number; vy: number
  rotation: number; rotSp: number
  scale: number; opacity: number
  color: string
  life: number       // 0 → 1 (dead)
  maxLife: number    // frames
  shape: 'leaf' | 'petal'
}

function drawLeaf(ctx: CanvasRenderingContext2D, p: Particle) {
  ctx.save()
  ctx.translate(p.x, p.y)
  ctx.rotate(p.rotation)
  ctx.scale(p.scale, p.scale)
  ctx.globalAlpha = p.opacity

  if (p.shape === 'leaf') {
    ctx.beginPath()
    ctx.moveTo(0, -8)
    ctx.bezierCurveTo(5, -4, 5, 4, 0, 8)
    ctx.bezierCurveTo(-5, 4, -5, -4, 0, -8)
    ctx.fillStyle = p.color
    ctx.fill()
    // midrib
    ctx.beginPath()
    ctx.moveTo(0, -7)
    ctx.lineTo(0, 7)
    ctx.strokeStyle = 'rgba(255,255,255,0.25)'
    ctx.lineWidth = 0.7
    ctx.stroke()
  } else {
    // rounded petal
    ctx.beginPath()
    ctx.ellipse(0, 0, 3.5, 7, 0, 0, Math.PI * 2)
    ctx.fillStyle = p.color
    ctx.fill()
  }

  ctx.restore()
}

function spawnBurst(
  canvas: HTMLCanvasElement,
  cx: number,
  cy: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const count = 14 + Math.floor(Math.random() * 6)
  const particles: Particle[] = []

  for (let i = 0; i < count; i++) {
    // bias spray upward & outward
    const angle = (Math.random() * Math.PI * 2)
    const speed = 2.5 + Math.random() * 4
    particles.push({
      x: cx, y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2.5,  // upward bias
      rotation: Math.random() * Math.PI * 2,
      rotSp: (Math.random() - 0.5) * 0.18,
      scale: 0.6 + Math.random() * 0.9,
      opacity: 1,
      color: LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)],
      life: 0,
      maxLife: 70 + Math.floor(Math.random() * 40),
      shape: Math.random() > 0.35 ? 'leaf' : 'petal',
    })
  }

  let rafId: number

  function tick() {
    ctx!.clearRect(0, 0, canvas.width, canvas.height)
    let alive = false

    for (const p of particles) {
      p.life++
      if (p.life >= p.maxLife) continue
      alive = true

      const t = p.life / p.maxLife
      p.x += p.vx
      p.y += p.vy
      p.vy += 0.12               // gravity
      p.vx *= 0.98               // air drag
      p.rotation += p.rotSp
      p.opacity = t < 0.6 ? 1 : 1 - (t - 0.6) / 0.4

      drawLeaf(ctx!, p)
    }

    if (alive) rafId = requestAnimationFrame(tick)
    else {
      ctx!.clearRect(0, 0, canvas.width, canvas.height)
      cancelAnimationFrame(rafId)
    }
  }

  rafId = requestAnimationFrame(tick)
}

// ── Icon map for impactStats ─────────────────────────────────────────────────

const ICON_SVG: Record<string, React.ReactNode> = {
  leaf: (
    <svg width="11" height="13" viewBox="0 0 11 13" fill="none" aria-hidden>
      <path d="M5.5 12 C5.5 12 1 8.5 1 4.5 A4.5 4.5 0 0 1 10 4.5 C10 8.5 5.5 12 5.5 12Z" fill="#788a6b" opacity="0.9"/>
      <path d="M5.5 5.5 C4.5 4 3 3.5 2.5 4" stroke="#9ab87a" strokeWidth="0.7" strokeLinecap="round"/>
    </svg>
  ),
  drop: (
    <svg width="10" height="13" viewBox="0 0 10 13" fill="none" aria-hidden>
      <path d="M5 1 C5 1 1 6 1 8.5 A4 4 0 0 0 9 8.5 C9 6 5 1 5 1Z" fill="#4a9ab8" opacity="0.85"/>
    </svg>
  ),
  fish: (
    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden>
      <path d="M1 5 C1 5 3 1 7 1 C11 1 13 5 13 5 C13 5 11 9 7 9 C3 9 1 5 1 5Z" fill="#4a7ab8" opacity="0.8"/>
      <circle cx="10" cy="4" r="1" fill="rgba(255,255,255,0.7)"/>
      <path d="M1 5 L-1 2 M1 5 L-1 8" stroke="#4a7ab8" strokeWidth="1.2" strokeLinecap="round" opacity="0.8"/>
    </svg>
  ),
  sun: (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
      <circle cx="6.5" cy="6.5" r="3" fill="#c4930a" opacity="0.9"/>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <line
          key={deg}
          x1={6.5 + 4 * Math.cos((deg * Math.PI) / 180)}
          y1={6.5 + 4 * Math.sin((deg * Math.PI) / 180)}
          x2={6.5 + 5.5 * Math.cos((deg * Math.PI) / 180)}
          y2={6.5 + 5.5 * Math.sin((deg * Math.PI) / 180)}
          stroke="#c4930a"
          strokeWidth="1.1"
          strokeLinecap="round"
          opacity="0.8"
        />
      ))}
    </svg>
  ),
}

// ── Component ────────────────────────────────────────────────────────────────

export default function Hero({
  profile,
  settings,
  primary,
  headingTone,
  mutedTone,
  spaceGap,
}: {
  profile: UserProfile
  settings: ThemeSettings
  primary: string
  headingTone: string
  mutedTone: string
  spaceGap: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handle =
    profile.slug.startsWith('@') ? profile.slug : `@${profile.slug}`
  const primaryBody =
    profile.description?.trim() || profile.bio?.trim() || ''

  const handleAvatarClick = useCallback((e: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    // 將 CSS 座標轉換為 canvas 像素座標
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    spawnBurst(canvas, (e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY)
  }, [])

  return (
    <div className="relative">
      {/* Full-hero canvas overlay — pointer-events: none so it never blocks clicks */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-20"
        style={{ width: '100%', height: '100%' }}
        width={600}
        height={500}
        aria-hidden
      />

      <div
        className="flex flex-col items-center px-6 py-6 sm:px-8 lg:px-9 lg:py-10 hl-brand-entry-fade"
        style={{
          gap: `${Math.max(12, spaceGap * 1.25)}px`,
          ['--hl-entry-dur' as string]: '0.65s',
        }}
      >
        {/* Avatar — clickable */}
        <button
          type="button"
          aria-label="點擊送出祝福"
          onClick={handleAvatarClick}
          className="relative z-10 h-20 w-20 cursor-pointer overflow-hidden rounded-full border-[3px] bg-hl-gold-soft shadow-[inset_0_0_0_2px_rgba(166,124,0,0.35)] transition-transform duration-150 active:scale-95 lg:h-24 lg:w-24 lg:border-4"
          style={{ borderColor: primary }}
        >
          {profile.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatarUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center text-2xl font-bold lg:text-3xl"
              style={{ color: primary }}
            >
              {profile.name.slice(0, 1)}
            </div>
          )}
        </button>

        <h1
          className="text-center text-xl font-bold tracking-[0.06em] lg:text-[1.65rem]"
          style={{ color: headingTone }}
        >
          {profile.name}
        </h1>

        <p
          className="text-xs font-semibold uppercase tracking-[0.14em] lg:text-[13px]"
          style={{ color: primary }}
        >
          {handle}
        </p>

        {settings.showBio ? (
          <p
            className="w-full max-w-sm whitespace-pre-wrap text-center text-xs leading-relaxed lg:text-[13px] lg:leading-[1.7]"
            style={{ color: mutedTone }}
          >
            {primaryBody || '這個品牌正在使用 HypeLink 打造數位名片。'}
          </p>
        ) : null}

        {/* Impact stats */}
        {profile.metadata?.impactStats?.length ? (
          <div className="flex w-full max-w-sm flex-wrap justify-center gap-x-5 gap-y-2 border-t border-hl-border/40 pt-3">
            {profile.metadata.impactStats.map((stat, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="shrink-0">{ICON_SVG[stat.icon]}</span>
                <span className="text-[10px] leading-tight" style={{ color: mutedTone }}>
                  {stat.label}{' '}
                  <span className="font-mono font-semibold" style={{ color: headingTone }}>
                    {stat.value}
                  </span>
                </span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
