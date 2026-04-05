type ChartLoadingStateProps = {
  showLegend?: boolean
}

export function ChartLoadingState({ showLegend = false }: ChartLoadingStateProps) {
  return (
    <div className="animate-pulse space-y-4">
      <div className="flex items-center justify-between gap-3 rounded-[18px] border border-line bg-[var(--surface-soft)] px-4 py-3">
        <div className="h-3 w-32 rounded-full bg-white/8" />
        <div className="h-8 w-20 rounded-full bg-white/8" />
      </div>
      <div className="relative h-[280px] overflow-hidden rounded-[20px] border border-line bg-[linear-gradient(180deg,var(--surface-elevated),var(--surface-panel))]">
        <div className="absolute inset-x-4 bottom-6 top-6 rounded-[16px] border border-white/5" />
        <div className="absolute bottom-10 left-6 h-28 w-28 rounded-full bg-[rgba(99,245,174,0.08)] blur-3xl" />
        <div className="absolute right-6 top-8 h-24 w-24 rounded-full bg-[rgba(96,165,250,0.08)] blur-3xl" />
      </div>
      {showLegend ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-12 rounded-[16px] border border-line bg-[var(--surface-soft)]" />
          ))}
        </div>
      ) : null}
    </div>
  )
}
