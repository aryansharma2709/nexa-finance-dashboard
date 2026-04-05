import { AnalyticsRow } from '@/features/dashboard/components/analytics-row'
import { InsightsSection } from '@/features/dashboard/components/insights-section'
import { KpiSummarySection } from '@/features/dashboard/components/kpi-summary-section'
import { TransactionsSection } from '@/features/dashboard/components/transactions-section'
import { useDashboardSectionSync } from '@/features/dashboard/hooks/use-dashboard-section-sync'

export function DashboardShellPage() {
  useDashboardSectionSync()

  return (
    <div className="space-y-5 lg:space-y-6">
      <KpiSummarySection />
      <AnalyticsRow />
      <InsightsSection />
      <TransactionsSection />
    </div>
  )
}
