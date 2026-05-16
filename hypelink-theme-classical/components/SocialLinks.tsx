'use client'

import { QrCode } from 'lucide-react'

import { socialHref, socialIconForStringType } from '../lib/social-icon'
import type { SocialLink } from '../types'

function visibleSocials(items: SocialLink[]) {
  return items.filter((s) => s.isVisible !== false).sort((a, b) => a.order - b.order)
}

export default function SocialLinks({
  items,
  primary,
  mutedTone,
  spaceGap,
  shareLabel,
}: {
  items: SocialLink[]
  primary: string
  mutedTone: string
  spaceGap: number
  /** 靜態預覽用，例如當前頁 URL */
  shareUrl?: string
  shareLabel?: string
}) {
  const list = visibleSocials(items)
  if (!list.length) return null

  const socialSz = 36

  return (
    <div
      className="flex flex-wrap justify-center px-6 pb-6 sm:px-8 lg:px-9"
      style={{ gap: `${Math.max(8, spaceGap)}px` }}
    >
      {list.map((soc) => {
        const Icon = socialIconForStringType(soc.type)
        return (
          <a
            key={soc.id}
            href={socialHref(soc.url)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex shrink-0 items-center justify-center rounded-full border border-hl-border bg-hl-parchment-shadow/80 transition-colors hover:bg-hl-parchment-elevated"
            style={{
              width: socialSz,
              height: socialSz,
            }}
          >
            <Icon
              className="shrink-0"
              style={{
                width: Math.max(14, socialSz * 0.45),
                height: Math.max(14, socialSz * 0.45),
                color: mutedTone,
              }}
              strokeWidth={2}
            />
          </a>
        )
      })}
      <button
        type="button"
        className="flex shrink-0 items-center justify-center rounded-full font-semibold text-white transition-opacity hover:opacity-90"
        style={{
          width: socialSz,
          height: socialSz,
          backgroundColor: primary,
        }}
        aria-label={shareLabel ?? '顯示 QR Code 與分享'}
        onClick={() => {
          if (typeof window === 'undefined') return
          const url = window.location.href
          // 平台會監聽 hypelink:share-qr 並開啟含 QR Code + 分享按鈕的彈窗
          window.dispatchEvent(
            new CustomEvent('hypelink:share-qr', { detail: { url } }),
          )
        }}
      >
        <QrCode className="h-[18px] w-[18px] text-white" strokeWidth={2.5} />
      </button>
    </div>
  )
}
