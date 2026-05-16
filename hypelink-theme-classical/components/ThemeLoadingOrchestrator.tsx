'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'

import ForestGrowTransition from './ForestGrowTransition'

/**
 * 主題載入四階段：
 * 1. intro    — 開場畫面（品牌 logo 淡入）
 * 2. loading  — 載入中 loop（進度條 + logo 脈動）
 * 3. forest   — 森林由地面生長、繁茂後淡出
 * 4. content  — 顯示主要內容
 */
type Stage = 'intro' | 'loading' | 'forest' | 'content'

/** 載入進度模擬配置 */
const INTRO_DURATION = 600        // 開場停留 ms
const MIN_LOADING_DURATION = 1400 // 最少載入畫面時間 ms（讓進度條有感）
/** 需與 globals.css `--hl-forest-duration` 一致（3.8s） */
const FOREST_DURATION = 3800

export default function ThemeLoadingOrchestrator({
  ready,
  accentColor = '#8b2942',
  brandLogoUrl,
  logoUrl,
  brandName,
  children,
}: {
  /** 主要內容是否準備好（資料載入完成） */
  ready: boolean
  /** 主題主色 */
  accentColor?: string
  /** 品牌自訂 Logo URL（優先顯示，來自基本資料設定） */
  brandLogoUrl?: string
  /** 品牌頭貼 URL（brandLogoUrl 不存在時的 fallback） */
  logoUrl?: string
  /** 品牌名稱 */
  brandName?: string
  /** 主要內容 */
  children: React.ReactNode
}) {
  const [stage, setStage] = useState<Stage>('intro')
  const [progress, setProgress] = useState(0)
  const readyRef = useRef(ready)
  /** 以元件掛載時刻做為進度計時起點，避免進度條跳接不平滑 */
  const loadingStartRef = useRef<number>(Date.now())

  readyRef.current = ready

  // Stage 1 → Stage 2
  useEffect(() => {
    const t = setTimeout(() => {
      loadingStartRef.current = Date.now()
      setStage('loading')
    }, INTRO_DURATION)
    return () => clearTimeout(t)
  }, [])

  // Stage 2：以「經過時間」為主導的進度
  useEffect(() => {
    if (stage !== 'loading') return
    let raf = 0
    let cancelled = false
    const tick = () => {
      if (cancelled) return
      const elapsed = Date.now() - loadingStartRef.current
      const base = Math.min(90, (elapsed / 1800) * 90)
      const target = readyRef.current ? 100 : base
      setProgress((prev) => {
        if (prev >= target) return prev
        const eased = prev + Math.max(0.6, (target - prev) * 0.18)
        return Math.min(target, Math.round(eased * 10) / 10)
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
    }
  }, [stage])

  // Stage 2 → Stage 3：資料 ready + 最少停留時間後進入森林轉場
  const startForest = useCallback(() => {
    const elapsed = Date.now() - loadingStartRef.current
    const remaining = Math.max(0, MIN_LOADING_DURATION - elapsed)
    setTimeout(() => setStage('forest'), remaining)
  }, [])

  useEffect(() => {
    if (stage === 'loading' && ready) {
      startForest()
    }
  }, [stage, ready, startForest])

  // Stage 3 → 4：森林動畫完整播畢後才顯示品牌頁
  useEffect(() => {
    if (stage !== 'forest') return
    const t = setTimeout(() => setStage('content'), FOREST_DURATION)
    return () => clearTimeout(t)
  }, [stage])

  const initial = brandName?.slice(0, 1) ?? 'H'

  // Stage 4: 直接顯示內容
  if (stage === 'content') {
    return <div className="hl-content-reveal">{children}</div>
  }

  return (
    <>
      {/* Stage 1 + 2：開場 + 載入中 */}
      {(stage === 'intro' || stage === 'loading') && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-hl-parchment-elevated">
          <div
            className={`flex h-20 w-20 items-center justify-center rounded-2xl ${
              stage === 'intro' ? 'hl-stage-intro' : 'hl-loader-pulse'
            }`}
            style={{ backgroundColor: `${accentColor}14` }}
          >
            {brandLogoUrl ? (
              <img
                src={brandLogoUrl}
                alt=""
                className="h-14 w-14 object-contain"
              />
            ) : logoUrl ? (
              <img
                src={logoUrl}
                alt=""
                className="h-12 w-12 rounded-xl object-contain"
              />
            ) : (
              <span
                className="text-3xl font-bold"
                style={{ color: accentColor }}
              >
                {initial}
              </span>
            )}
          </div>

          {stage === 'loading' && (
            <div className="mt-8 flex w-48 flex-col items-center gap-3">
              <div className="h-1 w-full overflow-hidden rounded-full bg-hl-parchment-shadow">
                <div
                  className="hl-progress-bar h-full rounded-full"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: accentColor,
                  }}
                />
              </div>
              <span className="text-xs font-medium text-hl-muted">
                {Math.round(progress)}%
              </span>
            </div>
          )}
        </div>
      )}

      {/* Stage 3：森林生長轉場 */}
      {stage === 'forest' && (
        <>
          <div className="opacity-0" aria-hidden>
            {children}
          </div>
          <ForestGrowTransition />
        </>
      )}
    </>
  )
}
