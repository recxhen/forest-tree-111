/**
 * 品牌頁骨架屏 — 在主要內容資料尚未載入時顯示。
 * 使用 CSS `.hl-skeleton` shimmer 動畫，不依賴外部套件。
 */
export default function ThemeSkeleton() {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* 側欄骨架 */}
      <aside className="flex w-full shrink-0 flex-col items-center gap-5 border-[#e5e7eb] bg-white/95 px-8 py-10 lg:w-[min(400px,36vw)] lg:max-w-[400px] lg:border-r">
        {/* 頭貼 */}
        <div className="hl-skeleton h-20 w-20 !rounded-full lg:h-24 lg:w-24" />
        {/* 名稱 */}
        <div className="hl-skeleton h-6 w-36" />
        {/* handle */}
        <div className="hl-skeleton h-4 w-24" />
        {/* 簡介 */}
        <div className="flex w-full max-w-[280px] flex-col gap-2">
          <div className="hl-skeleton h-3 w-full" />
          <div className="hl-skeleton h-3 w-4/5" />
        </div>
        {/* 社群圓示 */}
        <div className="flex gap-3 pt-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="hl-skeleton h-9 w-9 !rounded-full" />
          ))}
        </div>
      </aside>

      {/* 內容區骨架 */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Tab 列骨架 */}
        <div className="flex justify-center gap-4 border-b border-[#e5e7eb] px-4 py-3">
          <div className="hl-skeleton h-5 w-16" />
          <div className="hl-skeleton h-5 w-16" />
          <div className="hl-skeleton h-5 w-16" />
        </div>
        {/* 卡片網格骨架 */}
        <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-3 px-4 py-6 sm:grid-cols-2 lg:px-10">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="hl-skeleton h-[120px] w-full sm:h-[132px]" />
          ))}
        </div>
      </div>
    </div>
  )
}
