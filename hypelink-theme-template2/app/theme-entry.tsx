import './globals.css'
import ThemeLoadingOrchestrator from '../components/ThemeLoadingOrchestrator'
import ThemePreviewLayout from '../components/ThemePreviewLayout'
import ThemeSkeleton from '../components/ThemeSkeleton'
import { ThemeSettingsSchema } from '../settings.schema'
import type { ThemeContext } from '../types'

export default function ThemeEntry({ context }: { context: ThemeContext }) {
  // safeParse：平台傳入的 settings 可能不完全符合主題 schema，
  // 驗證失敗時使用預設值，確保不會 crash
  const result = ThemeSettingsSchema.safeParse(context.settings ?? {})
  const settings = result.success ? result.data : ThemeSettingsSchema.parse({})

  // 判斷資料是否已準備好（有 profile 代表 API 資料已到）
  const ready = !!context.profile?.name

  return (
    <ThemeLoadingOrchestrator
      ready={ready}
      accentColor={settings.accentColor}
      brandLogoUrl={context.profile?.brandLogoUrl}
      logoUrl={context.profile?.avatarUrl}
      brandName={context.profile?.name}
    >
      {ready ? (
        <ThemePreviewLayout context={context} settings={settings} />
      ) : (
        <ThemeSkeleton />
      )}
    </ThemeLoadingOrchestrator>
  )
}
