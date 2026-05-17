'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'

/**
 * 主題載入四階段：
 * 1. intro    — 開場畫面（品牌 logo 淡入）
 * 2. loading  — 載入中 loop（進度條 + logo 脈動）
 * 3. wipe     — 轉場動畫（色塊滑入蓋滿 → 滑出）
 * 4. content  — 顯示主要內容
 */
type Stage = 'intro' | 'loading' | 'wipe-in' | 'wipe-out' | 'content'

/** 載入進度模擬配置 */
const INTRO_DURATION = 600        // 開場停留 ms
const MIN_LOADING_DURATION = 1400 // 最少載入畫面時間 ms（讓進度條有感）
const WIPE_DURATION = 400         // 轉場動畫時間 ms

export default function ThemeLoadingOrchestrator({
  ready,
  accentColor = '#7B61FF',
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

  // Stage 2：以「經過時間」為主導的進度（純時間函數，不與 startWipe 的
  // setProgress(100) 競爭，避免先跳到 100、rAF 再被搶走的情況）
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
        // 只上升、不下降；以 0.18 緩動；並保證每幀最少 +0.6 不停滯
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

  // Stage 2 → Stage 3：資料 ready + 最少停留時間後進入轉場
  const startWipe = useCallback(() => {
    const elapsed = Date.now() - loadingStartRef.current
    const remaining = Math.max(0, MIN_LOADING_DURATION - elapsed)
    setTimeout(() => setStage('wipe-in'), remaining)
  }, [])

  useEffect(() => {
    if (stage === 'loading' && ready) {
      startWipe()
    }
  }, [stage, ready, startWipe])

  // Stage 3a → 3b → 4：wipe-in 結束後 wipe-out，再顯示內容
  useEffect(() => {
    if (stage === 'wipe-in') {
      const t = setTimeout(() => setStage('wipe-out'), WIPE_DURATION)
      return () => clearTimeout(t)
    }
    if (stage === 'wipe-out') {
      const t = setTimeout(() => setStage('content'), WIPE_DURATION)
      return () => clearTimeout(t)
    }
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
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
          {/* Logo / 品牌首字 */}
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

          {/* 載入進度 */}
          {stage === 'loading' && (
            <div className="mt-8 flex w-48 flex-col items-center gap-3">
              {/* 進度條 */}
              <div className="h-1 w-full overflow-hidden rounded-full bg-[#f0f0f0]">
                <div
                  className="hl-progress-bar h-full rounded-full"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: accentColor,
                  }}
                />
              </div>
              {/* 百分比 */}
              <span className="text-xs font-medium text-[#9ca3af]">
                {Math.round(progress)}%
              </span>
            </div>
          )}
        </div>
      )}

      {/* Stage 3：轉場色塊 */}
      {(stage === 'wipe-in' || stage === 'wipe-out') && (
        <>
          {/* 底下先放好內容（被色塊遮住） */}
          <div className="opacity-0">{children}</div>
          {/* 色塊 */}
          <div
            className={`fixed inset-0 z-50 ${
              stage === 'wipe-in' ? 'hl-wipe-enter' : 'hl-wipe-exit'
            }`}
            style={{ backgroundColor: accentColor }}
          />
        </>
      )}
    </>
  )
}
