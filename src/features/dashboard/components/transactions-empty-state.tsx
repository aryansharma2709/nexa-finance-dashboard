import { RotateCcw, SearchX } from 'lucide-react'
import { DashboardStatePanel } from '@/features/dashboard/components/dashboard-state-panel'

type TransactionsEmptyStateProps = {
  hasFilters: boolean
  onReset: () => void
}

export function TransactionsEmptyState({ hasFilters, onReset }: TransactionsEmptyStateProps) {
  return (
    <DashboardStatePanel
      eyebrow={hasFilters ? 'No Results' : 'No Data'}
      title={hasFilters ? 'No transactions match these filters' : 'No transactions available'}
      description={
        hasFilters
          ? 'The current search and filter combination narrowed the ledger to zero rows. Clear the active filters to restore the full transaction history.'
          : 'Transactions will appear here once records are available through the mock API and persisted dashboard state.'
      }
      icon={<SearchX size={24} />}
      action={
        hasFilters ? (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-11 items-center gap-2 rounded-[16px] border border-line bg-[var(--surface-soft)] px-4 text-sm font-medium text-text transition hover:border-line-strong"
          >
            <RotateCcw size={16} />
            Clear all filters
          </button>
        ) : null
      }
    />
  )
}
