import { DatabaseZap } from 'lucide-react'
import { RefreshCcw } from 'lucide-react'
import { DashboardStatePanel } from '@/features/dashboard/components/dashboard-state-panel'
import { KpiCard } from '@/features/dashboard/components/kpi-card'
import { useDashboardSummary } from '@/features/dashboard/hooks/use-dashboard-summary'

function SummarySkeletonCard() {
  return (
    <div className="animate-pulse rounded-[24px] border border-line bg-[linear-gradient(180deg,var(--surface-elevated),var(--surface-panel))] p-5 shadow-panel">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="h-4 w-24 rounded-full bg-white/6" />
          <div className="mt-4 h-10 w-36 rounded-full bg-white/8" />
        </div>
        <div className="h-12 w-12 rounded-[18px] border border-line bg-white/6" />
      </div>
      <div className="mt-5 h-14 rounded-[18px] bg-white/6" />
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="h-8 w-28 rounded-full bg-white/7" />
        <div className="h-3 w-24 rounded-full bg-white/6" />
      </div>
    </div>
  )
}

export function KpiSummarySection() {
  const { items, isEmpty, isLoading, isPending, error, refetch } = useDashboardSummary()

  return (
    <section id="dashboard" className="scroll-mt-36 space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-text-subtle">
            Summary Layer
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-[-0.03em] text-text">
            Financial overview at a glance
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-text-muted">
            These KPIs are sourced from the mock API and derived selector layer, so the cards reflect the same
            finance state the rest of the dashboard will use.
          </p>
        </div>

        {error ? (
          <button
            type="button"
            onClick={() => void refetch()}
            className="inline-flex h-11 items-center gap-2 self-start rounded-[18px] border border-[rgba(251,113,133,0.18)] bg-[rgba(251,113,133,0.08)] px-4 text-sm text-[rgba(255,202,210,0.92)]"
          >
            <RefreshCcw size={16} />
            Retry summary
          </button>
        ) : null}
      </div>

      {error ? (
        <div className="rounded-[24px] border border-[rgba(251,113,133,0.18)] bg-[rgba(251,113,133,0.06)] p-5 text-sm leading-6 text-[rgba(255,202,210,0.92)]">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <SummarySkeletonCard key={index} />
          ))}
        </div>
      ) : isEmpty ? (
        <DashboardStatePanel
          eyebrow="Summary Gap"
          title="KPI summary is waiting for data"
          description="Once the mock API has transaction history to work with, the overview cards will populate with derived totals, savings rate, and monthly movement."
          icon={<DatabaseZap size={24} />}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-5">
          {items.map((item) => (
            <KpiCard key={item.key} item={item} />
          ))}
        </div>
      )}

      {isPending ? (
        <p className="text-xs uppercase tracking-[0.24em] text-text-subtle">Refreshing summary data...</p>
      ) : null}
    </section>
  )
}
