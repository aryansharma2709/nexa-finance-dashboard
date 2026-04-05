import { DatabaseZap, RefreshCcw } from 'lucide-react'
import { DashboardStatePanel } from '@/features/dashboard/components/dashboard-state-panel'
import { InsightCard } from '@/features/dashboard/components/insight-card'
import { useDashboardInsights } from '@/features/dashboard/hooks/use-dashboard-insights'

function InsightLoadingCard() {
  return (
    <div className="animate-pulse rounded-[24px] border border-line bg-[linear-gradient(180deg,var(--surface-elevated),var(--surface-panel))] p-5 shadow-panel">
      <div className="h-4 w-36 rounded-full bg-white/6" />
      <div className="mt-5 h-10 w-28 rounded-full bg-white/8" />
      <div className="mt-4 h-12 rounded-[18px] bg-white/6" />
      <div className="mt-3 h-3 w-full rounded-full bg-white/5" />
      <div className="mt-2 h-3 w-4/5 rounded-full bg-white/5" />
    </div>
  )
}

export function InsightsSection() {
  const { cards, isLoading, isPending, error, refetch, isEmpty } = useDashboardInsights()

  return (
    <section id="insights" className="scroll-mt-36 space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-text-subtle">Insights Layer</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-[-0.03em] text-text">Actionable observations</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-text-muted">
            Short signals derived from real transaction patterns, monthly movement, and the current savings profile.
          </p>
        </div>
        {error ? (
          <button
            type="button"
            onClick={() => void refetch()}
            className="inline-flex h-11 items-center gap-2 self-start rounded-[18px] border border-[rgba(251,113,133,0.18)] bg-[rgba(251,113,133,0.08)] px-4 text-sm text-[rgba(255,202,210,0.92)]"
          >
            <RefreshCcw size={16} />
            Retry insights
          </button>
        ) : null}
      </div>

      {error ? (
        <div className="rounded-[24px] border border-[rgba(251,113,133,0.18)] bg-[rgba(251,113,133,0.06)] p-5 text-sm leading-6 text-[rgba(255,202,210,0.92)]">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <InsightLoadingCard key={index} />
          ))}
        </div>
      ) : isEmpty ? (
        <DashboardStatePanel
          eyebrow="Insights Gap"
          title="No insights are ready yet"
          description="These observation cards appear after the mock API has enough transaction history to derive savings, momentum, and processing watchlist signals."
          icon={<DatabaseZap size={24} />}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {cards.map((item) => (
            <InsightCard key={item.key} item={item} />
          ))}
        </div>
      )}

      {isPending ? <p className="text-xs uppercase tracking-[0.24em] text-text-subtle">Refreshing insights...</p> : null}
    </section>
  )
}
