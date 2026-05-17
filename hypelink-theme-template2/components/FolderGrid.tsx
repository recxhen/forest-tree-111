'use client'

import { useState, type CSSProperties } from 'react'

import { parseLinkFolderSections } from '../lib/link-folder-sections'
import type { ThemeFolderTabsSettings } from '../settings.schema'
import type { FolderItem } from '../types'

function cx(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(' ')
}

export default function FolderGrid({
  items,
  primary,
  folderTabs,
  activeSectionId,
  onSectionChange,
  linkCardRadiusClass: radiusCls,
  gridTwoCols,
  spaceGap,
}: {
  items: FolderItem[]
  primary: string
  folderTabs: ThemeFolderTabsSettings
  activeSectionId: string
  onSectionChange: (id: string) => void
  linkCardRadiusClass: string
  gridTwoCols: boolean
  spaceGap: number
}) {
  if (!items.length) return null

  const sections = parseLinkFolderSections(items)
  const active =
    sections.find((s) => s.id === activeSectionId) ?? sections[0] ?? null
  if (!active) return null

  const activeText = folderTabs.activeTextColor ?? primary
  const activeLine = folderTabs.activeIndicatorColor ?? primary

  const barStyle: CSSProperties = {
    borderBottomColor: folderTabs.barBorderColor,
    backgroundColor: folderTabs.barBackground,
    ...(folderTabs.barBackdropBlurPx > 0
      ? {
          WebkitBackdropFilter: `blur(${folderTabs.barBackdropBlurPx}px)`,
          backdropFilter: `blur(${folderTabs.barBackdropBlurPx}px)`,
        }
      : {}),
  }

  return (
    <>
      <div
        className="flex w-full flex-wrap justify-center border-b backdrop-blur-sm"
        style={barStyle}
      >
        <div className="flex flex-wrap justify-center">
          {sections.map((sec) => {
            const isActive = sec.id === active.id
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => onSectionChange(sec.id)}
                className={cx(
                  'border-b-2 px-5 py-2.5 text-sm font-medium transition-colors',
                  isActive ? 'border-solid' : 'border-transparent hover:opacity-85',
                )}
                style={
                  isActive
                    ? { borderBottomColor: activeLine, color: activeText }
                    : { color: folderTabs.inactiveColor }
                }
                onMouseEnter={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLButtonElement).style.color =
                      folderTabs.inactiveHoverColor
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLButtonElement).style.color =
                      folderTabs.inactiveColor
                }}
              >
                {sec.title}
              </button>
            )
          })}
        </div>
      </div>

      {/* 統一 grid：模組與連結混合排列 */}
      <div
        className="mx-auto w-full max-w-5xl px-4 pb-2 pt-4 lg:px-10 lg:pt-6"
      >
        <div
          className="grid grid-cols-1 sm:grid-cols-2"
          style={{ gap: `${Math.max(10, spaceGap * 1.25)}px` }}
        >
          {active.items.map((item) => {
            // ── 模組 ──
            if (item.type === 'page-module') {
              const isFull = item.moduleLayout !== 'half'
              return (
                <div
                  key={item.id}
                  className={isFull ? 'col-span-1 sm:col-span-2' : 'col-span-1'}
                >
                  {item.moduleSlot
                    ? <>{item.moduleSlot as React.ReactNode}</>
                    : <div className={`px-4 py-3 border border-[#e5e7eb] bg-white ${radiusCls}`}>
                        <p className="text-[13px] font-semibold text-[#18181b]">{item.title}</p>
                      </div>}
                </div>
              )
            }

            // ── 連結 ──
            const img = item.coverImage
            const inner = (
              <>
                {img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={img}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#e8e8e8] to-[#d4d4d4] text-xs text-[#9ca3af]">
                    無預覽圖
                  </div>
                )}
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-[60px] bg-gradient-to-t from-[#2f2f2f]/85 to-transparent"
                  aria-hidden
                />
                <div className="absolute inset-x-0 bottom-0 px-4 pb-3 pt-8">
                  <p className="text-[13px] font-semibold leading-snug text-white">
                    {item.title}
                  </p>
                </div>
              </>
            )

            const cardClassName = `relative block h-[120px] w-full overflow-hidden border border-black/[0.06] bg-[#f0f0f0] sm:h-[132px] ${radiusCls}`

            if (item.clickBehavior === 'expand-text' && item.expandHtml) {
              return (
                <ExpandTextCard
                  key={item.id}
                  item={item}
                  inner={inner}
                  cardClassName={cardClassName}
                  radiusCls={radiusCls}
                />
              )
            }

            if (item.href) {
              return (
                <a
                  key={item.id}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cardClassName}
                >
                  {inner}
                </a>
              )
            }

            return (
              <div key={item.id} className={cardClassName}>
                {inner}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

/**
 * 顯示文字模式卡片：點擊不跳轉，於下方展開 expandHtml。
 * expandHtml 由平台 sanitize 過，這裡可直接用 dangerouslySetInnerHTML。
 */
function ExpandTextCard({
  item,
  inner,
  cardClassName,
  radiusCls,
}: {
  item: FolderItem
  inner: React.ReactNode
  cardClassName: string
  radiusCls: string
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="block w-full">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cardClassName}
      >
        {inner}
        <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-[#5b21b6]">
          {open ? '收起 ▴' : '展開 ▾'}
        </span>
      </button>
      {open && item.expandHtml ? (
        <div
          className={`mt-2 bg-white p-4 text-[13px] leading-relaxed text-[#374151] shadow-sm ${radiusCls}`}
          dangerouslySetInnerHTML={{ __html: item.expandHtml }}
        />
      ) : null}
    </div>
  )
}
