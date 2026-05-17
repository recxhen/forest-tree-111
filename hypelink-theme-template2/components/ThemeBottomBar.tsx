'use client'

import type { CSSProperties } from 'react'
import { Box, Crown, Heart, Link2, ShoppingBag } from 'lucide-react'

import type { ThemeBottomBarSettings } from '../settings.schema'

export type DockTab = 'links' | 'space' | 'shop' | 'member'

const DOCK_TABS: {
  id: DockTab
  label: string
  icon: typeof Link2
  showKey: keyof ThemeBottomBarSettings | null
}[] = [
  { id: 'links', label: '連結', icon: Link2, showKey: null },
  { id: 'space', label: '空間', icon: Box, showKey: 'showLinkSpaceToggle' },
  { id: 'shop', label: 'Shop', icon: ShoppingBag, showKey: 'showShopTab' },
  { id: 'member', label: '會員', icon: Crown, showKey: 'showMemberTab' },
]

function cx(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(' ')
}

export default function ThemeBottomBar({
  bar,
  accentColor,
  favorited,
  onFavoriteToggle,
  onTab,
  activeTab,
  variant = 'bar',
  className,
}: {
  bar: ThemeBottomBarSettings
  accentColor: string
  favorited: boolean
  onFavoriteToggle: () => void
  onTab: (tab: DockTab) => void
  activeTab: DockTab
  /** "bar"：水平底欄（手機）；"grid"：2x2 方塊（桌面側欄） */
  variant?: 'bar' | 'grid'
  className?: string
}) {
  if (!bar.enabled) return null

  const iconOn = bar.iconActiveColor ?? accentColor
  const iconOff = bar.iconInactiveColor

  const visibleTabs = DOCK_TABS.filter(
    (t) => t.showKey === null || bar[t.showKey],
  )

  const dockStyle: CSSProperties = {
    backgroundColor: bar.background,
    borderColor: bar.borderColor,
    borderRadius: bar.borderRadiusPx,
    boxShadow: bar.boxShadow,
    WebkitBackdropFilter: `blur(${bar.backdropBlurPx}px)`,
    backdropFilter: `blur(${bar.backdropBlurPx}px)`,
  }

  // ── Grid 模式：2x2 大方塊 ──
  if (variant === 'grid') {
    return (
      <div className={cx('flex flex-col gap-2', className)}>
        <div className="grid grid-cols-2 gap-2">
          {visibleTabs.map((tab) => {
            const active = activeTab === tab.id
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTab(tab.id)}
                className={cx(
                  'flex flex-col items-center justify-center gap-1.5 rounded-2xl border px-2 py-4 transition-all',
                  active
                    ? 'border-transparent shadow-sm'
                    : 'border-[#e5e7eb] hover:border-[#d4d4d8]',
                )}
                style={
                  active
                    ? {
                        backgroundColor: bar.iconActiveBackground,
                        color: iconOn,
                      }
                    : { color: iconOff }
                }
              >
                <Icon className="h-6 w-6" strokeWidth={1.8} />
                <span
                  className={cx(
                    'text-[12px] font-medium',
                    active ? 'font-semibold' : '',
                  )}
                >
                  {tab.label}
                </span>
              </button>
            )
          })}
        </div>
        {bar.showFavorite ? (
          <button
            type="button"
            onClick={onFavoriteToggle}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border py-3 transition-colors"
            style={
              favorited
                ? {
                    borderColor: bar.heartFavoriteBorder,
                    backgroundColor: bar.heartFavoriteBg,
                    color: bar.heartFavoriteIcon,
                  }
                : {
                    borderColor: bar.heartDefaultBorder,
                    backgroundColor: bar.heartDefaultBg,
                    color: bar.heartDefaultIcon,
                  }
            }
            aria-label={favorited ? '取消收藏（預覽）' : '收藏（預覽）'}
            aria-pressed={favorited}
          >
            <Heart
              className="h-5 w-5"
              strokeWidth={2}
              fill={favorited ? 'currentColor' : 'none'}
            />
            <span className="text-[12px] font-medium">
              {favorited ? '已收藏' : '收藏'}
            </span>
          </button>
        ) : null}
      </div>
    )
  }

  // ── Bar 模式：水平一排 ──
  return (
    <div
      className={cx(
        'flex items-center justify-center gap-1.5 border px-3 py-2',
        className,
      )}
      style={dockStyle}
    >
      {bar.showFavorite ? (
        <button
          type="button"
          onClick={onFavoriteToggle}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors"
          style={
            favorited
              ? {
                  borderColor: bar.heartFavoriteBorder,
                  backgroundColor: bar.heartFavoriteBg,
                  color: bar.heartFavoriteIcon,
                }
              : {
                  borderColor: bar.heartDefaultBorder,
                  backgroundColor: bar.heartDefaultBg,
                  color: bar.heartDefaultIcon,
                }
          }
          aria-label={favorited ? '取消收藏（預覽）' : '收藏（預覽）'}
          aria-pressed={favorited}
        >
          <Heart
            className="h-5 w-5"
            strokeWidth={2}
            fill={favorited ? 'currentColor' : 'none'}
          />
        </button>
      ) : null}

      {visibleTabs.map((tab) => {
        const active = activeTab === tab.id
        const Icon = tab.icon
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTab(tab.id)}
            className="flex h-10 w-10 items-center justify-center rounded-xl transition-colors hover:opacity-95"
            style={
              active
                ? {
                    backgroundColor: bar.iconActiveBackground,
                    color: iconOn,
                  }
                : { color: iconOff }
            }
            aria-label={tab.label}
          >
            <Icon className="h-5 w-5" strokeWidth={2} />
          </button>
        )
      })}
    </div>
  )
}
