import { RefreshCcw } from 'lucide-react'
import { TransactionsExportMenu } from '@/features/dashboard/components/transactions-export-menu'
import { TransactionFormModal } from '@/features/dashboard/components/transaction-form-modal'
import { TransactionsFiltersBar } from '@/features/dashboard/components/transactions-filters-bar'
import { TransactionsTable } from '@/features/dashboard/components/transactions-table'
import { useTransactionsTable } from '@/features/dashboard/hooks/use-transactions-table'

function TransactionsLoadingState() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="rounded-[24px] border border-line bg-[linear-gradient(180deg,var(--surface-elevated),var(--surface-panel))] p-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="h-12 w-full rounded-[18px] bg-white/6 xl:max-w-[420px]" />
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="h-12 rounded-[18px] bg-white/6" />
            <div className="h-12 rounded-[18px] bg-white/6" />
            <div className="h-12 rounded-[18px] bg-white/6" />
          </div>
        </div>
        <div className="mt-4 grid gap-3">
          <div className="h-10 rounded-[18px] bg-white/5" />
          <div className="h-10 rounded-[18px] bg-white/5" />
        </div>
      </div>
      <div className="rounded-[24px] border border-line bg-[linear-gradient(180deg,var(--surface-elevated),var(--surface-panel))] p-4">
        <div className="h-10 rounded-[18px] bg-white/6" />
        <div className="mt-4 space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-16 rounded-[18px] bg-white/5" />
          ))}
        </div>
      </div>
    </div>
  )
}

export function TransactionsSection() {
  const {
    query,
    table,
    rows,
    visibleTransactions,
    role,
    filters,
    hasActiveSharedFilters,
    categoryOptions,
    typeOptions,
    paymentMethodOptions,
    statusOptions,
    setSearch,
    toggleCategory,
    toggleType,
    togglePaymentMethod,
    toggleStatus,
    setDateRange,
    resetFilters,
    flexRender,
    admin,
  } = useTransactionsTable()

  return (
    <section id="transactions" className="scroll-mt-36 space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-text-subtle">Transactions Layer</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-[-0.03em] text-text">Transaction activity</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-text-muted">
            Shared filters drive this table, including category filters applied from the spending breakdown chart.
          </p>
        </div>
        <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto lg:justify-end">
          <span
            className={
              role === 'Admin'
                ? 'rounded-full border border-[rgba(99,245,174,0.22)] bg-[rgba(99,245,174,0.12)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-accent'
                : 'rounded-full border border-line bg-[var(--surface-soft)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted'
            }
          >
            {role === 'Admin' ? 'Admin access enabled' : 'Viewer read-only'}
          </span>
          <TransactionsExportMenu transactions={visibleTransactions} filters={filters} />
          {role === 'Admin' ? (
            <button
              type="button"
              onClick={admin.openCreate}
              className="inline-flex h-11 items-center rounded-[18px] border border-[rgba(99,245,174,0.18)] bg-[rgba(99,245,174,0.12)] px-4 text-sm font-medium text-accent transition hover:border-[rgba(99,245,174,0.28)]"
            >
              Add Transaction
            </button>
          ) : (
            <div className="rounded-[18px] border border-line bg-[var(--surface-soft)] px-4 py-2 text-sm text-text-muted">
              Viewer mode is read only
            </div>
          )}
          {query.error ? (
            <button
              type="button"
              onClick={() => void query.refetch()}
              className="inline-flex h-11 items-center gap-2 rounded-[18px] border border-[rgba(251,113,133,0.18)] bg-[rgba(251,113,133,0.08)] px-4 text-sm text-[rgba(255,202,210,0.92)]"
            >
              <RefreshCcw size={16} />
              Retry table
            </button>
          ) : null}
        </div>
      </div>

      {query.error ? (
        <div className="rounded-[24px] border border-[rgba(251,113,133,0.18)] bg-[rgba(251,113,133,0.06)] p-5 text-sm leading-6 text-[rgba(255,202,210,0.92)]">
          {query.error}
        </div>
      ) : null}

      {query.isLoading ? (
        <TransactionsLoadingState />
      ) : (
        <>
          <TransactionsFiltersBar
            filters={filters}
            hasActiveFilters={hasActiveSharedFilters}
            categoryOptions={categoryOptions}
            typeOptions={typeOptions}
            paymentMethodOptions={paymentMethodOptions}
            statusOptions={statusOptions}
            onSearchChange={setSearch}
            onToggleCategory={toggleCategory}
            onToggleType={toggleType}
            onTogglePaymentMethod={togglePaymentMethod}
            onToggleStatus={toggleStatus}
            onDateRangeChange={setDateRange}
            onReset={resetFilters}
          />
          <TransactionsTable
            table={table}
            rows={rows}
            flexRender={flexRender}
            hasActiveFilters={hasActiveSharedFilters}
            onResetFilters={resetFilters}
          />
        </>
      )}

      {query.isPending ? (
        <p className="text-xs uppercase tracking-[0.24em] text-text-subtle">Refreshing transactions...</p>
      ) : null}

      <TransactionFormModal
        open={admin.isOpen}
        mode={admin.mode}
        values={admin.values}
        errors={admin.errors}
        transaction={admin.selectedTransaction}
        isSubmitting={admin.isSubmitting}
        onClose={admin.closeModal}
        onChange={admin.updateField}
        onSubmit={() => void admin.submit()}
      />
    </section>
  )
}
