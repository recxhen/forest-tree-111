import type { LucideIcon } from 'lucide-react'
import {
  AtSign,
  CircleDot,
  Facebook,
  Github,
  Globe,
  Instagram,
  Link2,
  Linkedin,
  MessageCircle,
  Mic,
  Music,
  Music2,
  PenTool,
  Pin,
  Twitter,
  Youtube,
} from 'lucide-react'

/** 與 `PublicHypeLinkClient` 的 `socialHref` 一致 */
export function socialHref(data: string): string {
  const t = data.trim()
  if (!t) return '#'
  if (t.startsWith('http://') || t.startsWith('https://')) return t
  return `https://${t}`
}

/**
 * 主題 JSON 使用字串型 `type`（instagram、youtube…），對應公開頁以數字 enum 選 Lucide 圖示。
 */
export function socialIconForStringType(type: string): LucideIcon {
  const t = type.trim().toLowerCase()
  switch (t) {
    case 'instagram':
      return Instagram
    case 'facebook':
      return Facebook
    case 'youtube':
      return Youtube
    case 'threads':
    case 'line':
    case 'whatsapp':
      return MessageCircle
    case 'website':
    case 'web':
    case 'globe':
      return Globe
    case 'tiktok':
    case 'music':
      return Music2
    case 'twitter':
    case 'x':
      return Twitter
    case 'linkedin':
      return Linkedin
    case 'email':
    case 'mail':
      return AtSign
    case 'pinterest':
      return Pin
    case 'spotify':
      return Music
    case 'podcast':
      return Mic
    case 'github':
      return Github
    case 'behance':
      return PenTool
    case 'dribbble':
      return CircleDot
    case 'link':
    case 'other':
      return Link2
    default:
      return Globe
  }
}
