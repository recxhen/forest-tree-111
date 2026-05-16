'use client'

import { useState, type CSSProperties } from 'react'

import { isForestCornerSection } from '../lib/forest-corner-sections'
import { parseLinkFolderSections } from '../lib/link-folder-sections'
import type { ThemeFolderTabsSettings } from '../settings.schema'
import type { FolderItem } from '../types'

const FUNDRAISING_TITLES = ['珊瑚礁緊急募款', '珊瑚礁復育緊急募款', '山林復育行動基金', '海洋廢棄物行動計劃', '海洋廢棄物清除計畫']

function FundingBar({ item }: { item: FolderItem }) {
  const { currentAmount, targetAmount } = item.metadata ?? {}
  const current = currentAmount ?? 75
  const target = targetAmount ?? 100
  const pct = Math.min(100, Math.round((current / target) * 100))

  return (
    <div className="mt-1.5 flex items-center gap-2">
      <div
        className="relative h-[5px] flex-1 overflow-hidden rounded-full"
        style={{ backgroundColor: '#1b2e24' }}
      >
        <div
          className="hl-fund-bar-fill absolute inset-y-0 left-0 rounded-full"
          style={{ width: `${pct}%`, backgroundColor: '#788a6b' }}
        />
      </div>
      <span className="shrink-0 text-[10px] font-semibold text-white/80">
        已達成 {pct}%
      </span>
    </div>
  )
}

function isFundraisingItem(item: FolderItem) {
  return FUNDRAISING_TITLES.some((t) => item.title.includes(t))
}
import CornerForest from './CornerForest'

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
  const showCornerForest = isForestCornerSection(active.title)

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
      {showCornerForest ? <CornerForest key={active.id} /> : null}

      <div className="relative z-10">
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
                    : <div className={`border border-hl-border bg-hl-parchment-elevated px-4 py-3 shadow-sm ${radiusCls}`}>
                        <p className="text-[13px] font-semibold text-hl-ink">{item.title}</p>
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
                  <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-[#dcd3c2] to-[#c9bba8] text-xs text-hl-muted">
                    無預覽圖
                  </div>
                )}
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-[60px] bg-linear-to-t from-[#2f2f2f]/85 to-transparent"
                  aria-hidden
                />
                <div className="absolute inset-x-0 bottom-0 px-4 pb-3 pt-8">
                  <p className="text-[13px] font-semibold leading-snug text-white">
                    {item.title}
                  </p>
                  {isFundraisingItem(item) && <FundingBar item={item} />}
                </div>
              </>
            )

            const cardClassName = `relative z-10 block h-[120px] w-full overflow-hidden border border-hl-border/90 bg-hl-parchment-shadow sm:h-[132px] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] ${radiusCls}`

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
    <div className="relative z-10 block w-full">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cardClassName}
      >
        {inner}
        <span className="absolute right-3 top-3 rounded-full border border-hl-border bg-hl-parchment-elevated/95 px-2 py-0.5 text-[10px] font-bold text-hl-gold shadow-sm">
          {open ? '收起 ▴' : '展開 ▾'}
        </span>
      </button>
      {open && item.expandHtml ? (
        <div
          className={`mt-2 border border-hl-border bg-hl-parchment-elevated p-4 text-[13px] leading-relaxed text-hl-muted shadow-sm ${radiusCls}`}
          dangerouslySetInnerHTML={{ __html: item.expandHtml }}
        />
      ) : null}
    </div>
  )
}
