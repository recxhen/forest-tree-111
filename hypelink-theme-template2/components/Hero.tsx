import type { ThemeSettings, UserProfile } from '../types'

export default function Hero({
  profile,
  settings,
  primary,
  headingTone,
  mutedTone,
  spaceGap,
}: {
  profile: UserProfile
  settings: ThemeSettings
  primary: string
  headingTone: string
  mutedTone: string
  spaceGap: number
}) {
  const handle =
    profile.slug.startsWith('@') ? profile.slug : `@${profile.slug}`
  const primaryBody =
    profile.description?.trim() || profile.bio?.trim() || ''

  return (
    <div
      className="flex flex-col items-center gap-4 px-6 py-6 sm:px-8 lg:gap-7 lg:px-9 lg:py-10 hl-brand-entry-fade"
      style={{
        gap: `${Math.max(12, spaceGap * 1.25)}px`,
        ['--hl-entry-dur' as string]: '0.65s',
      }}
    >
      <div
        className="h-20 w-20 overflow-hidden rounded-full border-2 bg-[#f5f3ff] lg:h-24 lg:w-24 lg:border-[3px]"
        style={{ borderColor: primary }}
      >
        {profile.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatarUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center text-2xl font-bold lg:text-3xl"
            style={{ color: primary }}
          >
            {profile.name.slice(0, 1)}
          </div>
        )}
      </div>
      <h1
        className="text-xl font-extrabold tracking-wide lg:text-2xl"
        style={{ color: headingTone }}
      >
        {profile.name}
      </h1>
      <p
        className="text-xs font-semibold lg:text-[13px]"
        style={{ color: primary }}
      >
        {handle}
      </p>
      {settings.showBio ? (
        <p
          className="w-full max-w-sm whitespace-pre-wrap text-center text-xs leading-relaxed lg:text-[13px] lg:leading-[1.7]"
          style={{ color: mutedTone }}
        >
          {primaryBody || '這個品牌正在使用 HypeLink 打造數位名片。'}
        </p>
      ) : null}
    </div>
  )
}
