'use client'

import { useEffect, useState } from 'react'
import ThemeEntry from './theme-entry'
import {
  getMockContext,
  MOCK_CONTEXT_KEYS,
  type MockContextKey,
} from '../lib/mock-context'
import type { ThemeContext } from '../types'

/**
 * 根路徑：本地預覽頁面。
 * 模擬 2 秒延遲載入，讓開發者可以看到 stage 1~3 的載入效果。
 *
 * 切換 fixture：用網址參數 `?mock=<key>`，例如：
 *   /?mock=desktop-os  → 預覽 macOS 風格桌面（lg 以上）
 *   /?mock=full        → 預設完整資料（傳統版型）
 */
export default function ThemePreviewPage() {
  const [context, setContext] = useState<ThemeContext | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const raw = params.get('mock')
    const key: MockContextKey =
      raw && (MOCK_CONTEXT_KEYS as readonly string[]).includes(raw)
        ? (raw as MockContextKey)
        : 'full'
    // 模擬平台載入延遲（2 秒後傳入資料）
    const t = setTimeout(() => {
      setContext(getMockContext(key))
    }, 2000)
    return () => clearTimeout(t)
  }, [])

  // 傳入空 context 觸發 stage 1~3；資料到達後自動進入 stage 4
  const mockContext: ThemeContext = context ?? {
    profile: { id: '', slug: '', name: '', locale: 'zh-TW', verified: false },
    socialLinks: [],
    folderItems: [],
    spaceLinks: [],
    settings: {},
  }

  return <ThemeEntry context={mockContext} />
}
