'use client'

import React, { useEffect, useMemo, useState } from 'react'

import DesktopOsLayout from './desktop/DesktopOsLayout'
import FolderGrid from './FolderGrid'
import Hero from './Hero'
import SocialLinks from './SocialLinks'
import ThemeBottomBar, { type DockTab } from './ThemeBottomBar'
import { parseLinkFolderSections } from '../lib/link-folder-sections'
import {
  linkCardRadiusClass,
  PREVIEW_HEADING_TONE,
  PREVIEW_MUTED_TONE,
} from '../lib/preview-styles'
import type { ThemeSettings } from '../settings.schema'
import type { ThemeContext } from '../types'

function cx(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(' ')
}

/** 從 settings 或 designSettings 的 background 物件取得背景樣式 */
function backgroundStyle(settings: ThemeSettings, ds: Record<string, unknown>): React.CSSProperties {
  const bg = ds.background as Record<string, unknown> | undefined
  if (bg?.type === 'image' && typeof bg.imageUrl === 'string' && bg.imageUrl) {
    const mode = bg.imageMode === 'contain' ? 'contain'
      : bg.imageMode === 'repeat' ? 'auto'
      : 'cover'
    return {
      backgroundImage: `url(${bg.imageUrl})`,
      backgroundSize: mode,
      backgroundPosition: 'center',
      backgroundRepeat: bg.imageMode === 'repeat' ? 'repeat' : 'no-repeat',
      opacity: typeof bg.opacity === 'number' ? bg.opacity : 1,
    }
  }
  return { backgroundColor: settings.backgroundColor }
}

export default function ThemePreviewLayout({
  context,
  settings,
}: {
  context: ThemeContext
  settings: ThemeSettings
}) {
  // 本地預覽用的內部 tab 狀態（有平台 slots.dock 時由 activeTab 控制）
  const [localTab, setLocalTab] = useState<DockTab>('links')
  const [favorited, setFavorited] = useState(false)

  const hasPlatformDock = !!(context.slots?.dockMobile || context.slots?.dockDesktop)
  const currentTab: DockTab = hasPlatformDock
    ? (context.activeTab ?? 'links')
    : localTab

  const sections = useMemo(
    () => parseLinkFolderSections(context.folderItems),
    [context.folderItems],
  )
  const [activeSectionId, setActiveSectionId] = useState(
    () => sections[0]?.id ?? '',
  )

  useEffect(() => {
    const first = sections[0]?.id
    if (!first) return
    if (!sections.some((s) => s.id === activeSectionId)) setActiveSectionId(first)
  }, [sections, activeSectionId])

  const primary = settings.accentColor
  const headingTone = PREVIEW_HEADING_TONE
  const mutedTone = PREVIEW_MUTED_TONE
  const spaceGap = 12
  const radiusCls = linkCardRadiusClass(settings.cardRadius)
  const gridTwoCols = settings.layout === 'grid'
  const bar = settings.bottomBar

  const asideHiddenMobileSpace = currentTab === 'space'

  const bgStyle = backgroundStyle(settings, context.settings as Record<string, unknown>)

  const localDockProps = {
    bar,
    accentColor: primary,
    favorited,
    onFavoriteToggle: () => setFavorited((v: boolean) => !v),
    onTab: setLocalTab,
    activeTab: localTab,
  }

  /** 手機底欄（bar 模式） */
  const mobileDock = context.slots?.dockMobile ? (
    <>{context.slots.dockMobile as React.ReactNode}</>
  ) : bar.enabled ? (
    <ThemeBottomBar {...localDockProps} variant="bar" />
  ) : null

  /** 桌面側欄（grid 模式） */
  const desktopDock = context.slots?.dockDesktop ? (
    <>{context.slots.dockDesktop as React.ReactNode}</>
  ) : bar.enabled ? (
    <ThemeBottomBar {...localDockProps} variant="grid" />
  ) : null

  // 桌面版排版：os = macOS 風格桌面（lg 以上）；traditional / 未設定 = 原行為
  const osMode = settings.desktopLayout?.mode === 'os'

  const legacyLayout = (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      {context.slots?.header ? (
        <>{context.slots.header as React.ReactNode}</>
      ) : (
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-[#e5e7eb] bg-white px-4 sm:px-6">
          <a href="/" className="flex shrink-0 items-center">
            {context.profile.brandLogoUrl ? (
              <img
                src={context.profile.brandLogoUrl}
                alt={context.profile.name}
                className="h-[22px] w-auto sm:h-6"
              />
            ) : (
              <span className="text-lg font-bold text-[#0a0a0a]">
                {context.profile.name || 'HypeLink'}
              </span>
            )}
          </a>
          {/* 右上角：本地預覽用登入占位 */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-full border border-[#e5e7eb] py-1 pl-1 pr-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f5f3ff] text-[10px] font-bold" style={{ color: primary }}>
                {context.profile.name?.slice(0, 1) || '?'}
              </div>
              <span className="text-[12px] font-medium text-[#374151]">
                {context.profile.name || '訪客'}
              </span>
            </div>
          </div>
        </header>
      )}

      <main className="relative flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* 背景層 */}
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={bgStyle}
          aria-hidden
        />
        <div className="relative z-10 flex min-h-0 min-w-0 flex-1 flex-col lg:flex-row">
          {/* ── 左側欄 ── */}
          <aside
            className={cx(
              'w-full shrink-0 border-[#e5e7eb] bg-white/95 backdrop-blur-[2px] lg:sticky lg:top-0 lg:max-h-screen lg:min-w-0 lg:overflow-y-auto lg:border-r lg:w-[min(400px,36vw)] lg:max-w-[400px] xl:w-[min(400px,32vw)]',
              asideHiddenMobileSpace && 'hidden lg:block',
            )}
          >
            <Hero
              profile={context.profile}
              settings={settings}
              primary={primary}
              headingTone={headingTone}
              mutedTone={mutedTone}
              spaceGap={spaceGap}
            />
            {/* 會員 CTA — 位於 handle 下方、社群圖示上方 */}
            {context.slots?.memberCta ? (
              <div className="flex justify-center px-6 pb-1 -mt-2 sm:px-8 lg:px-9">
                {context.slots.memberCta as React.ReactNode}
              </div>
            ) : null}
            <SocialLinks
              items={context.socialLinks}
              primary={primary}
              mutedTone={mutedTone}
              spaceGap={spaceGap}
            />

            {/* 桌面版 Dock — 側欄 2x2 grid */}
            {desktopDock ? (
              <div className="hidden px-5 pb-6 pt-2 lg:block">
                {desktopDock}
              </div>
            ) : null}

            <div className="hidden w-full max-w-sm border-t border-[#e5e7eb] px-9 pb-8 pt-6 lg:block">
              <p className="text-center text-[11px] font-medium text-[#9ca3af]">
                Powered by{' '}
                <a
                  href="https://hypelink.app"
                  className="text-[#7c3aed] hover:underline"
                >
                  HypeLink
                </a>
              </p>
            </div>
          </aside>

          {/* ── 右側內容 ── */}
          <div
            className={cx(
              'relative flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto bg-transparent',
              'pb-[max(5.5rem,env(safe-area-inset-bottom))] lg:pb-0',
            )}
          >
            {currentTab === 'links' ? (
              <>
                {context.folderItems.length ? (
                  <FolderGrid
                    items={context.folderItems}
                    primary={primary}
                    folderTabs={settings.folderTabs}
                    activeSectionId={activeSectionId}
                    onSectionChange={setActiveSectionId}
                    linkCardRadiusClass={radiusCls}
                    gridTwoCols={gridTwoCols}
                    spaceGap={spaceGap}
                  />
              ) : (
                <div className="flex min-h-[40vh] flex-1 items-center justify-center px-4 text-sm text-[#9ca3af]">
                  尚未新增連結
                </div>
              )}
              </>
            ) : null}

            {currentTab === 'space' ? (
              context.slots?.spaceEmbed ? (
                <>{context.slots.spaceEmbed as React.ReactNode}</>
              ) : (
                <div className="flex min-h-[50vh] flex-1 items-center justify-center px-6">
                  <p className="text-center text-sm text-[#9ca3af]">
                    空間預覽（靜態模板不含 3D 嵌入）
                  </p>
                </div>
              )
            ) : null}

            {currentTab === 'shop' ? (
              context.slots?.shopTab ? (
                <>{context.slots.shopTab as React.ReactNode}</>
              ) : (
                <div className="flex min-h-[50vh] flex-1 items-center justify-center px-6 text-sm text-[#9ca3af]">
                  Shop 即將推出
                </div>
              )
            ) : null}

            {currentTab === 'member' ? (
              context.slots?.memberTab ? (
                <>{context.slots.memberTab as React.ReactNode}</>
              ) : (
                <div className="flex min-h-[50vh] flex-1 items-center justify-center px-6 text-sm text-[#9ca3af]">
                  會員專區（主題預覽占位）
                </div>
              )
            ) : null}
          </div>
        </div>

        {/* 手機版 Dock — 固定底部（桌面隱藏） */}
        {mobileDock ? (
          <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] lg:hidden">
            <div className="pointer-events-auto flex w-full max-w-lg justify-center">
              {mobileDock}
            </div>
          </div>
        ) : null}
      </main>
    </div>
  )

  if (!osMode) return legacyLayout

  return (
    <>
      {/* 桌面 OS 模式（lg 以上） */}
      <div className="hidden lg:block">
        <DesktopOsLayout
          context={context}
          settings={settings}
          primary={primary}
        />
      </div>
      {/* 手機（<lg）維持傳統連結列表體驗 */}
      <div className="lg:hidden">{legacyLayout}</div>
    </>
  )
}
