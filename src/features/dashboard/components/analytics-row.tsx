import { RefreshCcw } from 'lucide-react'
import { BalanceTrendCard } from '@/features/dashboard/components/balance-trend-card'
import { SpendingBreakdownCard } from '@/features/dashboard/components/spending-breakdown-card'
import { useDashboardAnalytics } from '@/features/dashboard/hooks/use-dashboard-analytics'

export function AnalyticsRow() {
  const {
    activeRange,
    setActiveRange,
    balanceTrendData,
    spendingBreakdown,
    isLoading,
    isPending,
    error,
    refetch,
    isBalanceEmpty,
    isBreakdownEmpty,
    activeCategories,
    toggleCategory,
  } = useDashboardAnalytics()

  return (
    <section id="analytics" className="scroll-mt-36 space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-text-subtle">Analytics Row</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-[-0.03em] text-text">Core financial analytics</h2>
        </div>
        {error ? (
          <button
            type="button"
            onClick={() => void refetch()}
            className="inline-flex h-11 items-center gap-2 self-start rounded-[18px] border border-[rgba(251,113,133,0.18)] bg-[rgba(251,113,133,0.08)] px-4 text-sm text-[rgba(255,202,210,0.92)]"
          >
            <RefreshCcw size={16} />
            Retry analytics
          </button>
        ) : null}
      </div>

      {error ? (
        <div className="rounded-[24px] border border-[rgba(251,113,133,0.18)] bg-[rgba(251,113,133,0.06)] p-5 text-sm leading-6 text-[rgba(255,202,210,0.92)]">
          {error}
        </div>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(380px,0.95fr)]">
        <BalanceTrendCard
          data={balanceTrendData}
          activeRange={activeRange}
          onRangeChange={setActiveRange}
          isLoading={isLoading}
          isEmpty={isBalanceEmpty}
        />
        <SpendingBreakdownCard
          data={spendingBreakdown}
          activeCategories={activeCategories}
          onCategoryClick={toggleCategory}
          isLoading={isLoading}
          isEmpty={isBreakdownEmpty}
        />
      </div>

      {isPending ? (
        <p className="text-xs uppercase tracking-[0.24em] text-text-subtle">Refreshing analytics data...</p>
      ) : null}
    </section>
  )
}
