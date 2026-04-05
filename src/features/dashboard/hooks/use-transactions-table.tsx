import { useMemo, useState } from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table'
import { useTransactionsQuery } from '@/features/finance/api/use-finance-queries'
import type { PaymentMethod, Transaction, TransactionCategory, TransactionKind, TransactionStatus } from '@/features/finance/types'
import { paymentMethods, transactionCategories, transactionStatuses, transactionKinds } from '@/features/finance/types'
import { useTransactionAdmin } from '@/features/dashboard/hooks/use-transaction-admin'
import { useDashboardStore } from '@/store/dashboard-store'
import { hasActiveFilters, selectFilteredTransactions } from '@/store/dashboard-selectors'
import { TransactionRowActions } from '@/features/dashboard/components/transaction-row-actions'
import { TransactionStatusPill } from '@/features/dashboard/components/transaction-status-pill'

const columnHelper = createColumnHelper<Transaction>()

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

function formatAmount(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

export function useTransactionsTable() {
  const query = useTransactionsQuery()
  const transactions = useDashboardStore((state) => state.transactions)
  const filters = useDashboardStore((state) => state.filters)
  const role = useDashboardStore((state) => state.role)
  const setSearch = useDashboardStore((state) => state.setSearch)
  const setCategories = useDashboardStore((state) => state.setCategories)
  const setPaymentMethods = useDashboardStore((state) => state.setPaymentMethods)
  const setStatuses = useDashboardStore((state) => state.setStatuses)
  const setTypes = useDashboardStore((state) => state.setTypes)
  const setDateRange = useDashboardStore((state) => state.setDateRange)
  const resetFilters = useDashboardStore((state) => state.resetFilters)
  const [sorting, setSorting] = useState<SortingState>([{ id: 'date', desc: true }])
  const admin = useTransactionAdmin(query.refetch)

  const data = useMemo(
    () => selectFilteredTransactions({ transactions, filters }),
    [transactions, filters],
  )

  const columns = useMemo(
    () => [
      columnHelper.accessor('date', {
        id: 'date',
        header: 'Date',
        cell: ({ getValue }) => <span className="text-sm text-text">{formatDate(getValue())}</span>,
        sortingFn: 'datetime',
      }),
      columnHelper.accessor('merchant', {
        header: 'Merchant',
        cell: ({ row }) => (
          <div className="min-w-[180px]">
            <p className="text-sm font-medium text-text">{row.original.merchant}</p>
            <p className="mt-1 text-xs text-text-muted">{row.original.description}</p>
          </div>
        ),
      }),
      columnHelper.accessor('category', {
        header: 'Category',
        cell: ({ getValue }) => (
          <span className="inline-flex rounded-full border border-line bg-[rgba(255,255,255,0.03)] px-3 py-1 text-xs font-medium text-text-muted">
            {getValue()}
          </span>
        ),
      }),
      columnHelper.accessor('type', {
        header: 'Type',
        cell: ({ getValue }) => (
          <span
            className={
              getValue() === 'income'
                ? 'text-sm font-medium text-accent'
                : 'text-sm font-medium text-[rgba(251,113,133,0.92)]'
            }
          >
            {getValue() === 'income' ? 'Income' : 'Expense'}
          </span>
        ),
      }),
      columnHelper.accessor('paymentMethod', {
        header: 'Payment Method',
        cell: ({ getValue }) => <span className="text-sm text-text-muted">{getValue()}</span>,
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ getValue }) => <TransactionStatusPill status={getValue()} />,
      }),
      columnHelper.accessor('amount', {
        header: () => <div className="text-right">Amount</div>,
        cell: ({ row, getValue }) => (
          <div className="text-right">
            <span
              className={
                row.original.type === 'income'
                  ? 'text-sm font-semibold tabular-nums text-accent'
                  : 'text-sm font-semibold tabular-nums text-text'
              }
            >
              {formatAmount(getValue())}
            </span>
          </div>
        ),
        sortingFn: 'basic',
      }),
      columnHelper.display({
        id: 'actions',
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <TransactionRowActions
              role={role}
              transaction={row.original}
              disabled={admin.isSubmitting}
              onEdit={admin.openEdit}
              onDelete={admin.remove}
            />
          </div>
        ),
      }),
    ],
    [admin.isSubmitting, admin.openEdit, admin.remove, role],
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const visibleTransactions = useMemo(
    () => table.getRowModel().rows.map((row) => row.original),
    [table, sorting, data],
  )

  function toggleArrayFilter<T extends string>(current: T[], nextValue: T, setter: (values: T[]) => void) {
    setter(current.includes(nextValue) ? current.filter((item) => item !== nextValue) : [...current, nextValue])
  }

  return {
    query,
    table,
    rows: table.getRowModel().rows,
    visibleTransactions,
    role,
    filters,
    hasActiveSharedFilters: hasActiveFilters(filters),
    categoryOptions: transactionCategories,
    typeOptions: transactionKinds,
    paymentMethodOptions: paymentMethods,
    statusOptions: transactionStatuses,
    setSearch,
    toggleCategory: (category: TransactionCategory) => toggleArrayFilter(filters.categories, category, setCategories),
    toggleType: (type: TransactionKind) => toggleArrayFilter(filters.types, type, setTypes),
    togglePaymentMethod: (paymentMethod: PaymentMethod) =>
      toggleArrayFilter(filters.paymentMethods, paymentMethod, setPaymentMethods),
    toggleStatus: (status: TransactionStatus) => toggleArrayFilter(filters.statuses, status, setStatuses),
    setDateRange,
    resetFilters,
    flexRender,
    admin,
  }
}
