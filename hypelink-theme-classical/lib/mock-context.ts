import type { ThemeContext } from '../types'

import contextFull from '../mock/context.full.json'
import contextDesktopOs from '../mock/context.desktop-os.json'
import contextGridLayout from '../mock/context.grid-layout.json'
import contextMinimal from '../mock/context.minimal.json'
import contextSplitLayout from '../mock/context.split-layout.json'
import contextEmpty from '../examples/empty-context.json'
import contextExample from '../examples/example-context.json'

/** 與 `mock/manifest.json` 對齊的 fixture 鍵 */
export const MOCK_CONTEXT_KEYS = [
  'full',
  'desktop-os',
  'minimal',
  'grid-layout',
  'split-layout',
  'example',
  'empty',
] as const

export type MockContextKey = (typeof MOCK_CONTEXT_KEYS)[number]

const MOCK_MAP: Record<MockContextKey, ThemeContext> = {
  full: contextFull as ThemeContext,
  'desktop-os': contextDesktopOs as ThemeContext,
  minimal: contextMinimal as ThemeContext,
  'grid-layout': contextGridLayout as ThemeContext,
  'split-layout': contextSplitLayout as ThemeContext,
  example: contextExample as ThemeContext,
  empty: contextEmpty as ThemeContext,
}

export function getMockContext(key: MockContextKey): ThemeContext {
  return MOCK_MAP[key]
}

/** 方便在暫存頁或 Story 直接展開全部 fixture */
export const MOCK_CONTEXTS: Readonly<typeof MOCK_MAP> = MOCK_MAP
