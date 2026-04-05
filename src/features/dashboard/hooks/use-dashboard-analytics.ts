import { useMemo, useState } from 'react'
import type { TransactionCategory } from '@/features/finance/types'
import { useTransactionsQuery } from '@/features/finance/api/use-finance-queries'
import { buildBalanceTrendData, buildSpendingBreakdownData, filterTransactionsByRange } from '@/features/dashboard/lib/analytics'
import { useDashboardStore } from '@/store/dashboard-store'
import { selectFilteredTransactions } from '@/store/dashboard-selectors'
import type { AnalyticsRange } from '@/features/dashboard/types'

export function useDashboardAnalytics() {
  const [activeRange, setActiveRange] = useState<AnalyticsRange>('6M')
  const transactions = useDashboardStore((state) => state.transactions)
  const filters = useDashboardStore((state) => state.filters)
  const setCategories = useDashboardStore((state) => state.setCategories)
  const query = useTransactionsQuery()

  const filteredTransactions = useMemo(
    () => selectFilteredTransactions({ transactions, filters }),
    [transactions, filters],
  )

  const rangeTransactions = useMemo(
    () => filterTransactionsByRange(filteredTransactions, activeRange),
    [filteredTransactions, activeRange],
  )

  const balanceTrendData = useMemo(
    () => buildBalanceTrendData(rangeTransactions, activeRange),
    [rangeTransactions, activeRange],
  )

  const spendingBreakdown = useMemo(
    () => buildSpendingBreakdownData(rangeTransactions, filters.categories),
    [rangeTransactions, filters.categories],
  )

  function toggleCategory(category: TransactionCategory) {
    const nextCategories = filters.categories.includes(category)
      ? filters.categories.filter((item) => item !== category)
      : [...filters.categories, category]

    setCategories(nextCategories)
  }

  return {
    activeRange,
    setActiveRange,
    balanceTrendData,
    spendingBreakdown,
    isLoading: query.isLoading,
    isPending: query.isPending,
    error: query.error,
    refetch: query.refetch,
    isBalanceEmpty: !query.isLoading && balanceTrendData.length === 0,
    isBreakdownEmpty: !query.isLoading && spendingBreakdown.length === 0,
    activeCategories: filters.categories,
    toggleCategory,
  }
}
