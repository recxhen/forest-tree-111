import {
  resolveForestCorner,
  resolveSectionLayout,
  type SectionLayout,
} from './folder-item-layout'
import type { FolderItem } from '../types'

/** 由 `folderItems` 解析出的「連結分頁」：無 `href` 的 `folder` 為分頁標題，其後連結歸該分頁 */
export type LinkFolderSection = {
  id: string
  title: string
  description?: string
  items: FolderItem[]
  /** 分頁版面（來自分頁資料夾 metadata / tags） */
  sectionLayout: SectionLayout
  /** 是否顯示右下角森林裝飾 */
  forestCorner: boolean
}

function sectionFromHeader(
  item: FolderItem,
  sectionIndex: number,
  sectionItems: FolderItem[] = [],
): LinkFolderSection {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    items: sectionItems,
    sectionLayout: resolveSectionLayout(item, sectionIndex, sectionItems),
    forestCorner: resolveForestCorner(item, sectionIndex),
  }
}

function implicitSection(
  id: string,
  title: string,
  items: FolderItem[],
): LinkFolderSection {
  return {
    id,
    title,
    items,
    sectionLayout: 'default',
    forestCorner: false,
  }
}

const isSectionHeader = (i: FolderItem) => i.type === 'folder' && !i.href

/**
 * 將 `folderItems` 切成多個分頁。
 * - `type === 'folder'` 且無 `href`：新分頁標題。
 * - 開頭若為一般項目（無前置資料夾標題）：先收進標題為「連結」的隱含分頁。
 * - 若完全沒有資料夾標題：單一分頁「連結」，含全部可卡片化項目。
 */
export function parseLinkFolderSections(items: FolderItem[]): LinkFolderSection[] {
  if (!items.length) return []

  if (!items.some(isSectionHeader)) {
    return [
      implicitSection(
        '_all',
        '連結',
        items.filter((i) => !isSectionHeader(i)),
      ),
    ]
  }

  const sections: LinkFolderSection[] = []
  let leading: FolderItem[] = []

  for (const item of items) {
    if (isSectionHeader(item)) {
      if (leading.length) {
        sections.push(implicitSection('_implicit', '連結', leading))
        leading = []
      }
      sections.push({
        id: item.id,
        title: item.title,
        description: item.description,
        items: [],
        sectionLayout: 'default',
        forestCorner: false,
      })
    } else {
      if (!sections.length) leading.push(item)
      else sections[sections.length - 1]!.items.push(item)
    }
  }

  if (leading.length) {
    sections.unshift(implicitSection('_implicit', '連結', leading))
  }

  let headerIndex = 0
  return sections.map((sec) => {
    if (sec.id === '_implicit' || sec.id === '_all') return sec
    const header = items.find((i) => i.id === sec.id && isSectionHeader(i))
    if (!header) return sec
    const enriched = sectionFromHeader(header, headerIndex, sec.items)
    headerIndex += 1
    return enriched
  })
}
