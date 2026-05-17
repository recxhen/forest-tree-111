'use client'

import React, { useEffect, useMemo, useState } from 'react'

import FolderGrid from '../FolderGrid'
import Hero from '../Hero'
import SocialLinks from '../SocialLinks'
import SpaceCards from '../SpaceCards'
import { parseLinkFolderSections } from '../../lib/link-folder-sections'
import {
  linkCardRadiusClass,
  PREVIEW_HEADING_TONE,
  PREVIEW_MUTED_TONE,
} from '../../lib/preview-styles'
import type { ThemeDesktopApp, ThemeSettings } from '../../settings.schema'
import type { ThemeContext } from '../../types'

function Placeholder({ text }: { text: string }) {
  return (
    <div className="flex h-full min-h-[160px] items-center justify-center px-6 text-center text-sm text-[#9ca3af]">
      {text}
    </div>
  )
}

/**
 * 依 App 設定渲染視窗內容。盡量重用既有區塊元件（Hero / SocialLinks /
 * FolderGrid / SpaceCards），與傳統版型視覺一致；平台 runtime 才有的內容
 * （module / experience）在本地預覽顯示占位說明。
 */
export default function DesktopAppContent({
  app,
  context,
  settings,
  primary,
}: {
  app: ThemeDesktopApp
  context: ThemeContext
  settings: ThemeSettings
  primary: string
}) {
  const kind = app.contentKind ?? 'tab'

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
    if (!sections.some((s) => s.id === activeSectionId))
      setActiveSectionId(first)
  }, [sections, activeSectionId])

  if (kind === 'embed') {
    return app.embedUrl ? (
      <iframe
        src={app.embedUrl}
        title={app.label}
        className="h-full w-full"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      />
    ) : (
      <Placeholder text="尚未設定嵌入網址" />
    )
  }

  if (kind === 'rich') {
    return app.richContent ? (
      <div
        className="prose prose-sm max-w-none p-5"
        // 圖文內容由品牌主於編輯器輸入，平台已 sanitize
        dangerouslySetInnerHTML={{ __html: app.richContent }}
      />
    ) : (
      <Placeholder text="尚未設定圖文內容" />
    )
  }

  if (kind === 'module') {
    return (
      <Placeholder text="模組內容由平台 runtime 渲染（本地預覽不含模組）" />
    )
  }

  if (kind === 'experience') {
    return (
      <Placeholder text="互動體驗由平台 runtime 以 iframe 嵌入（本地預覽不含體驗）" />
    )
  }

  // kind === 'tab'
  const tab = app.tab ?? 'links'

  if (tab === 'hero') {
    return (
      <div className="flex flex-col">
        <Hero
          profile={context.profile}
          settings={settings}
          primary={primary}
          headingTone={PREVIEW_HEADING_TONE}
          mutedTone={PREVIEW_MUTED_TONE}
          spaceGap={12}
        />
        {context.slots?.memberCta ? (
          <div className="flex justify-center px-6 pb-1 -mt-2">
            {context.slots.memberCta as React.ReactNode}
          </div>
        ) : null}
        <SocialLinks
          items={context.socialLinks}
          primary={primary}
          mutedTone={PREVIEW_MUTED_TONE}
          spaceGap={12}
        />
      </div>
    )
  }

  if (tab === 'links') {
    return context.folderItems.length ? (
      <FolderGrid
        items={context.folderItems}
        primary={primary}
        folderTabs={settings.folderTabs}
        activeSectionId={activeSectionId}
        onSectionChange={setActiveSectionId}
        linkCardRadiusClass={linkCardRadiusClass(settings.cardRadius)}
        gridTwoCols={settings.layout === 'grid'}
        spaceGap={12}
      />
    ) : (
      <Placeholder text="尚未新增連結" />
    )
  }

  if (tab === 'space') {
    if (context.slots?.spaceEmbed)
      return <>{context.slots.spaceEmbed as React.ReactNode}</>
    return context.spaceLinks.length ? (
      <SpaceCards
        items={context.spaceLinks}
        linkCardRadiusClass={linkCardRadiusClass(settings.cardRadius)}
        spaceGap={12}
      />
    ) : (
      <Placeholder text="空間預覽（靜態模板不含 3D 嵌入）" />
    )
  }

  if (tab === 'shop') {
    return context.slots?.shopTab ? (
      <>{context.slots.shopTab as React.ReactNode}</>
    ) : (
      <Placeholder text="Shop 即將推出" />
    )
  }

  // tab === 'member'
  return context.slots?.memberTab ? (
    <>{context.slots.memberTab as React.ReactNode}</>
  ) : (
    <Placeholder text="會員專區（主題預覽占位）" />
  )
}
