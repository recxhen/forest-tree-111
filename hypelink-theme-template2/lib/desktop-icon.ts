/** OS 模式 App 圖示對應（對齊前端 `BrandDesktopAppIcon` 白名單） */
import {
  Box,
  Briefcase,
  Calendar,
  Crown,
  FileText,
  Heart,
  Link2,
  Phone,
  ShoppingBag,
  Sparkles,
  User,
} from 'lucide-react'

import type { ThemeDesktopApp } from '../settings.schema'

type IconCmp = typeof Phone

export const DESKTOP_APP_ICON_MAP: Record<
  ThemeDesktopApp['icon'],
  IconCmp
> = {
  phone: Phone,
  briefcase: Briefcase,
  'file-text': FileText,
  user: User,
  calendar: Calendar,
  'shopping-bag': ShoppingBag,
  heart: Heart,
  sparkles: Sparkles,
}

/** 內建分頁 icon（dock 對齊底欄語意） */
export const DESKTOP_TAB_ICON_MAP: Record<string, IconCmp> = {
  hero: User,
  links: Link2,
  space: Box,
  shop: ShoppingBag,
  member: Crown,
}

export function iconForApp(app: ThemeDesktopApp): IconCmp {
  return DESKTOP_APP_ICON_MAP[app.icon] ?? Sparkles
}
