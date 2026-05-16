'use client'

import React, { useRef, useState } from 'react'

import type { DesktopRect } from '../../lib/desktop-rect'

function cx(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(' ')
}

/**
 * 單一桌面 App 視窗：標題列可拖移、右下角可拖拉縮放。
 * 以純 pointer events 實作（範本不依賴 framer-motion），視覺對齊平台
 * `DesktopAppWindow`（macOS 交通燈 chrome；`chrome="phone"` 時為手機模擬器框）。
 */
export default function DesktopAppWindow({
  title,
  rect,
  container,
  chrome,
  onClose,
  children,
}: {
  title: string
  rect: DesktopRect
  container: { w: number; h: number }
  chrome: 'mac' | 'phone'
  onClose: () => void
  children: React.ReactNode
}) {
  const [pos, setPos] = useState({ x: rect.x, y: rect.y })
  const [size, setSize] = useState({ w: rect.w, h: rect.h })
  const dragRef = useRef<{ px: number; py: number; ox: number; oy: number } | null>(
    null,
  )
  const resizeRef = useRef<{
    px: number
    py: number
    ow: number
    oh: number
  } | null>(null)

  function onHeaderPointerDown(e: React.PointerEvent) {
    if (e.button !== 0) return
    e.currentTarget.setPointerCapture(e.pointerId)
    dragRef.current = { px: e.clientX, py: e.clientY, ox: pos.x, oy: pos.y }
  }
  function onHeaderPointerMove(e: React.PointerEvent) {
    const d = dragRef.current
    if (!d) return
    const x = Math.max(
      0,
      Math.min(container.w - 80, d.ox + (e.clientX - d.px)),
    )
    const y = Math.max(
      0,
      Math.min(container.h - 40, d.oy + (e.clientY - d.py)),
    )
    setPos({ x, y })
  }
  function endHeaderDrag(e: React.PointerEvent) {
    dragRef.current = null
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      /* noop */
    }
  }

  function onResizePointerDown(e: React.PointerEvent) {
    e.preventDefault()
    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
    resizeRef.current = {
      px: e.clientX,
      py: e.clientY,
      ow: size.w,
      oh: size.h,
    }
  }
  function onResizePointerMove(e: React.PointerEvent) {
    const r = resizeRef.current
    if (!r) return
    const w = Math.max(
      260,
      Math.min(container.w - pos.x, r.ow + (e.clientX - r.px)),
    )
    const h = Math.max(
      200,
      Math.min(container.h - pos.y, r.oh + (e.clientY - r.py)),
    )
    setSize({ w, h })
  }
  function endResize(e: React.PointerEvent) {
    resizeRef.current = null
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      /* noop */
    }
  }

  const isPhone = chrome === 'phone'

  return (
    <div
      className={cx(
        'pointer-events-auto absolute flex flex-col overflow-hidden border border-hl-border/90 bg-hl-parchment-elevated shadow-[0_24px_60px_rgba(42,35,25,0.28)]',
        isPhone ? 'rounded-[2rem]' : 'rounded-xl',
      )}
      style={{ left: pos.x, top: pos.y, width: size.w, height: size.h }}
    >
      {/* 標題列（macOS 交通燈） */}
      <div
        className="flex h-9 shrink-0 cursor-grab touch-none select-none items-center gap-2 border-b border-hl-border/80 bg-hl-parchment-shadow px-3 active:cursor-grabbing"
        onPointerDown={onHeaderPointerDown}
        onPointerMove={onHeaderPointerMove}
        onPointerUp={endHeaderDrag}
        onPointerCancel={endHeaderDrag}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="關閉視窗"
          className="h-3 w-3 rounded-full bg-[#FF5F57] transition hover:brightness-110"
        />
        <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
        <span className="h-3 w-3 rounded-full bg-[#28C840]" />
        <p className="flex-1 truncate text-center text-[12px] font-semibold text-hl-muted">
          {title}
        </p>
        <span className="h-3 w-[44px]" aria-hidden />
      </div>

      {/* 內容區 */}
      <div
        className={cx(
          'min-h-0 flex-1 overflow-auto',
          isPhone && 'bg-hl-parchment-elevated',
        )}
      >
        {children}
      </div>

      {/* 右下角縮放把手 */}
      <span
        role="separator"
        aria-label="調整視窗大小"
        onPointerDown={onResizePointerDown}
        onPointerMove={onResizePointerMove}
        onPointerUp={endResize}
        onPointerCancel={endResize}
        className="absolute bottom-0 right-0 h-4 w-4 cursor-nwse-resize touch-none"
        style={{
          background:
            'linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.18) 50%)',
        }}
      />
    </div>
  )
}
