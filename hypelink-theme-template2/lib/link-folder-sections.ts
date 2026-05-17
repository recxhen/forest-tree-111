import type { FolderItem } from '../types'

/** 由 `folderItems` 解析出的「連結分頁」：無 `href` 的 `folder` 為分頁標題，其後連結歸該分頁 */
export type LinkFolderSection = {
  id: string
  title: string
  description?: string
  items: FolderItem[]
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
      {
        id: '_all',
        title: '連結',
        items: items.filter((i) => !isSectionHeader(i)),
      },
    ]
  }

  const sections: LinkFolderSection[] = []
  let leading: FolderItem[] = []

  for (const item of items) {
    if (isSectionHeader(item)) {
      if (leading.length) {
        sections.push({
          id: '_implicit',
          title: '連結',
          items: leading,
        })
        leading = []
      }
      sections.push({
        id: item.id,
        title: item.title,
        description: item.description,
        items: [],
      })
    } else {
      if (!sections.length) leading.push(item)
      else sections[sections.length - 1]!.items.push(item)
    }
  }

  if (leading.length) {
    sections.unshift({
      id: '_implicit',
      title: '連結',
      items: leading,
    })
  }

  return sections
}
