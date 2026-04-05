import { RotateCcw, X } from 'lucide-react'
import type {
  PaymentMethod,
  TransactionCategory,
  TransactionFilters,
  TransactionKind,
  TransactionStatus,
} from '@/features/finance/types'
import { cn } from '@/lib/utils/cn'

type TransactionsFiltersBarProps = {
  filters: TransactionFilters
  hasActiveFilters: boolean
  categoryOptions: readonly TransactionCategory[]
  typeOptions: readonly TransactionKind[]
  paymentMethodOptions: readonly PaymentMethod[]
  statusOptions: readonly TransactionStatus[]
  onSearchChange: (value: string) => void
  onToggleCategory: (value: TransactionCategory) => void
  onToggleType: (value: TransactionKind) => void
  onTogglePaymentMethod: (value: PaymentMethod) => void
  onToggleStatus: (value: TransactionStatus) => void
  onDateRangeChange: (startDate: string | null, endDate: string | null) => void
  onReset: () => void
}

function FilterChip({
  active,
  label,
  onClick,
}: {
  active: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-1.5 text-xs font-semibold tracking-[0.12em] transition',
        active
          ? 'border-[rgba(99,245,174,0.18)] bg-[rgba(99,245,174,0.12)] text-accent'
          : 'border-line bg-[rgba(255,255,255,0.03)] text-text-muted hover:border-line-strong hover:text-text',
      )}
    >
      {label}
    </button>
  )
}

export function TransactionsFiltersBar({
  filters,
  hasActiveFilters,
  categoryOptions,
  typeOptions,
  paymentMethodOptions,
  statusOptions,
  onSearchChange,
  onToggleCategory,
  onToggleType,
  onTogglePaymentMethod,
  onToggleStatus,
  onDateRangeChange,
  onReset,
}: TransactionsFiltersBarProps) {
  const activeFilterCount =
    (filters.search ? 1 : 0) +
    filters.categories.length +
    filters.types.length +
    filters.paymentMethods.length +
    filters.statuses.length +
    (filters.startDate || filters.endDate ? 1 : 0)

  return (
    <div className="space-y-4 rounded-[24px] border border-line bg-[var(--surface-panel)] p-4 shadow-panel">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <input
          type="search"
          value={filters.search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search merchant, description, or category"
          className="h-12 w-full rounded-[18px] border border-line bg-[var(--surface-soft)] px-4 text-sm text-text outline-none placeholder:text-text-subtle transition focus:border-[rgba(99,245,174,0.24)] xl:max-w-[420px]"
        />

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="date"
            value={filters.startDate ?? ''}
            onChange={(event) => onDateRangeChange(event.target.value || null, filters.endDate)}
            className="h-12 rounded-[18px] border border-line bg-[var(--surface-soft)] px-4 text-sm text-text outline-none transition focus:border-[rgba(99,245,174,0.24)]"
          />
          <input
            type="date"
            value={filters.endDate ?? ''}
            onChange={(event) => onDateRangeChange(filters.startDate, event.target.value || null)}
            className="h-12 rounded-[18px] border border-line bg-[var(--surface-soft)] px-4 text-sm text-text outline-none transition focus:border-[rgba(99,245,174,0.24)]"
          />
          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-12 items-center gap-2 rounded-[18px] border border-line bg-[var(--surface-soft)] px-4 text-sm text-text-muted transition hover:border-line-strong hover:text-text"
          >
            <RotateCcw size={16} />
            Reset all filters
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 gap-y-2.5">
          <span className="mr-1 text-xs uppercase tracking-[0.24em] text-text-subtle">Category</span>
          {categoryOptions.map((category) => (
            <FilterChip
              key={category}
              active={filters.categories.includes(category)}
              label={category}
              onClick={() => onToggleCategory(category)}
            />
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 gap-y-2.5">
          <span className="mr-1 text-xs uppercase tracking-[0.24em] text-text-subtle">Type</span>
          {typeOptions.map((type) => (
            <FilterChip
              key={type}
              active={filters.types.includes(type)}
              label={type === 'income' ? 'Income' : 'Expense'}
              onClick={() => onToggleType(type)}
            />
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 gap-y-2.5">
          <span className="mr-1 text-xs uppercase tracking-[0.24em] text-text-subtle">Payment</span>
          {paymentMethodOptions.map((method) => (
            <FilterChip
              key={method}
              active={filters.paymentMethods.includes(method)}
              label={method}
              onClick={() => onTogglePaymentMethod(method)}
            />
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 gap-y-2.5">
          <span className="mr-1 text-xs uppercase tracking-[0.24em] text-text-subtle">Status</span>
          {statusOptions.map((status) => (
            <FilterChip
              key={status}
              active={filters.statuses.includes(status)}
              label={status}
              onClick={() => onToggleStatus(status)}
            />
          ))}
        </div>
      </div>

      {hasActiveFilters ? (
        <div className="space-y-3 border-t border-line pt-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-[0.24em] text-text-subtle">Active Filters</span>
              <span className="rounded-full border border-line bg-[var(--surface-soft)] px-3 py-1 text-xs font-semibold text-text-muted">
                {activeFilterCount} selected
              </span>
            </div>
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-[var(--surface-soft)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-text-muted transition hover:border-line-strong hover:text-text sm:w-auto"
            >
              <X size={14} />
              Clear all
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {filters.search ? (
              <FilterChip active label={`Search: ${filters.search}`} onClick={() => onSearchChange('')} />
            ) : null}
            {filters.categories.map((category) => (
              <FilterChip key={category} active label={category} onClick={() => onToggleCategory(category)} />
            ))}
            {filters.types.map((type) => (
              <FilterChip
                key={type}
                active
                label={type === 'income' ? 'Income' : 'Expense'}
                onClick={() => onToggleType(type)}
              />
            ))}
            {filters.paymentMethods.map((method) => (
              <FilterChip key={method} active label={method} onClick={() => onTogglePaymentMethod(method)} />
            ))}
            {filters.statuses.map((status) => (
              <FilterChip key={status} active label={status} onClick={() => onToggleStatus(status)} />
            ))}
            {filters.startDate || filters.endDate ? (
              <FilterChip
                active
                label={`${filters.startDate ?? 'Start'} to ${filters.endDate ?? 'Now'}`}
                onClick={() => onDateRangeChange(null, null)}
              />
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}
