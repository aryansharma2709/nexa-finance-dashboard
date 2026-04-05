import { useMemo } from 'react'
import { useTransactionsQuery } from '@/features/finance/api/use-finance-queries'
import type { DashboardInsightCard, KpiDeltaTone } from '@/features/dashboard/types'
import type { Transaction } from '@/features/finance/types'
import { useDashboardStore } from '@/store/dashboard-store'
import {
  calculateCategoryTotals,
  calculateDashboardTotals,
  calculateMonthlyTrendData,
  selectFilteredTransactions,
} from '@/store/dashboard-selectors'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
    notation: value >= 100000 ? 'compact' : 'standard',
  }).format(value)
}

function roundToTwo(value: number) {
  return Number(value.toFixed(2))
}

function calculatePercentageChange(current: number, previous: number) {
  if (previous === 0) {
    return null
  }

  return roundToTwo(((current - previous) / previous) * 100)
}

function toneFromValue(value: number | null, inverse = false): KpiDeltaTone {
  if (value === null || value === 0) {
    return 'neutral'
  }

  if (inverse) {
    return value < 0 ? 'positive' : 'negative'
  }

  return value > 0 ? 'positive' : 'negative'
}

function latestMonthKey(transactions: Transaction[]) {
  const sortedMonths = [...new Set(transactions.map((transaction) => transaction.date.slice(0, 7)))].sort()
  return sortedMonths[sortedMonths.length - 1] ?? null
}

export function useDashboardInsights() {
  const transactions = useDashboardStore((state) => state.transactions)
  const filters = useDashboardStore((state) => state.filters)
  const query = useTransactionsQuery()

  const cards = useMemo<DashboardInsightCard[]>(() => {
    const filteredTransactions = selectFilteredTransactions({ transactions, filters })
    const completedTransactions = filteredTransactions.filter((transaction) => transaction.status === 'completed')
    const categoryTotals = calculateCategoryTotals(filteredTransactions)
    const totals = calculateDashboardTotals(filteredTransactions)
    const monthlyTrend = calculateMonthlyTrendData(filteredTransactions)
    const latestMonth = monthlyTrend[monthlyTrend.length - 1]
    const previousMonth = monthlyTrend[monthlyTrend.length - 2]
    const latestMonthKeyValue = latestMonthKey(completedTransactions)

    const highestCategory = categoryTotals[0]
    const biggestExpense = completedTransactions
      .filter(
        (transaction) =>
          transaction.type === 'expense' &&
          (latestMonthKeyValue ? transaction.date.startsWith(latestMonthKeyValue) : true),
      )
      .sort((left, right) => right.amount - left.amount)[0]

    const latestExpense = latestMonth?.expenses ?? 0
    const previousExpense = previousMonth?.expenses ?? 0
    const expenseChange = calculatePercentageChange(latestExpense, previousExpense)

    const recurringSubscriptions = completedTransactions.filter(
      (transaction) => transaction.type === 'expense' && transaction.category === 'Subscriptions',
    )
    const recurringMerchants = [...new Set(recurringSubscriptions.map((transaction) => transaction.merchant))]
    const recurringAmount = recurringSubscriptions.reduce((sum, transaction) => sum + transaction.amount, 0)

    return [
      {
        key: 'highestSpendingCategory',
        title: 'Highest spending category',
        headline: highestCategory ? highestCategory.category : 'No category yet',
        description: highestCategory
          ? `${formatCurrency(highestCategory.amount)} spent across ${highestCategory.count} completed transactions.`
          : 'Completed expense data will surface the top category automatically.',
        badge: highestCategory ? `${highestCategory.percentage}% share` : undefined,
        tone: highestCategory && highestCategory.percentage > 25 ? 'negative' : 'neutral',
      },
      {
        key: 'biggestExpenseThisMonth',
        title: 'Biggest expense this month',
        headline: biggestExpense ? formatCurrency(biggestExpense.amount) : 'No expense yet',
        description: biggestExpense
          ? `${biggestExpense.merchant} in ${biggestExpense.category}.`
          : 'No completed expense has landed in the current month range.',
        badge: biggestExpense ? biggestExpense.paymentMethod : undefined,
        tone: biggestExpense ? 'negative' : 'neutral',
      },
      {
        key: 'monthlyExpenseComparison',
        title: 'Monthly expense comparison',
        headline: formatCurrency(latestExpense),
        description:
          expenseChange === null
            ? 'No previous month baseline is available for comparison.'
            : latestExpense >= previousExpense
              ? 'Current month expenses are running above the previous month.'
              : 'Current month expenses are below the previous month.',
        badge: expenseChange === null ? 'New' : `${expenseChange >= 0 ? '+' : ''}${expenseChange}%`,
        tone: toneFromValue(expenseChange, true),
      },
      {
        key: 'recurringSubscriptions',
        title: 'Recurring subscriptions detected',
        headline: recurringMerchants.length === 0 ? 'None detected' : `${recurringMerchants.length} active`,
        description:
          recurringMerchants.length === 0
            ? 'Subscription payments will appear here once recurring charges are present.'
            : `${formatCurrency(recurringAmount)} across ${recurringSubscriptions.length} completed charges.`,
        badge: recurringMerchants[0],
        tone: recurringMerchants.length > 0 ? 'neutral' : 'neutral',
      },
      {
        key: 'savingsRateInsight',
        title: 'Savings rate insight',
        headline: `${totals.savingsRate.toFixed(1)}%`,
        description:
          totals.savingsRate >= 35
            ? 'Savings discipline looks strong against realized income.'
            : 'Expense levels are compressing the current savings rate.',
        badge: totals.savingsRate >= 35 ? 'Healthy' : 'Watch',
        tone: totals.savingsRate >= 35 ? 'positive' : 'negative',
      },
    ]
  }, [transactions, filters])

  const hasData = cards.some(
    (card) =>
      card.headline !== 'No category yet' &&
      card.headline !== 'No expense yet' &&
      card.headline !== 'None detected',
  )

  return {
    cards,
    isLoading: query.isLoading,
    isPending: query.isPending,
    error: query.error,
    refetch: query.refetch,
    isEmpty: !query.isLoading && !hasData,
  }
}
