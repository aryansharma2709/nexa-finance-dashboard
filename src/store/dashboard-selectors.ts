import {
  transactionCategories,
  type CategoryTotal,
  type DashboardTotals,
  type InsightItem,
  type MonthlyTrendPoint,
  type Transaction,
  type TransactionFilters,
} from '@/features/finance/types'
import type { DashboardStore } from '@/store/dashboard-store'

function roundToTwo(value: number) {
  return Number(value.toFixed(2))
}

function isCompletedTransaction(transaction: Transaction) {
  return transaction.status === 'completed'
}

export function selectFilteredTransactions(state: Pick<DashboardStore, 'transactions' | 'filters'>) {
  const { transactions, filters } = state
  const normalizedSearch = filters.search.trim().toLowerCase()

  return transactions
    .filter((transaction) => {
      if (filters.categories.length > 0 && !filters.categories.includes(transaction.category)) {
        return false
      }

      if (filters.paymentMethods.length > 0 && !filters.paymentMethods.includes(transaction.paymentMethod)) {
        return false
      }

      if (filters.statuses.length > 0 && !filters.statuses.includes(transaction.status)) {
        return false
      }

      if (filters.types.length > 0 && !filters.types.includes(transaction.type)) {
        return false
      }

      if (filters.startDate && transaction.date < filters.startDate) {
        return false
      }

      if (filters.endDate && transaction.date > filters.endDate) {
        return false
      }

      if (!normalizedSearch) {
        return true
      }

      const haystack = `${transaction.description} ${transaction.merchant} ${transaction.category}`.toLowerCase()
      return haystack.includes(normalizedSearch)
    })
    .sort((left, right) => right.date.localeCompare(left.date))
}

export function calculateDashboardTotals(transactions: Transaction[]): DashboardTotals {
  const completedTransactions = transactions.filter(isCompletedTransaction)
  const totalIncome = completedTransactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((sum, transaction) => sum + transaction.amount, 0)
  const totalExpenses = completedTransactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((sum, transaction) => sum + transaction.amount, 0)
  const totalBalance = totalIncome - totalExpenses
  const netSavings = totalBalance
  const savingsRate = totalIncome > 0 ? roundToTwo((netSavings / totalIncome) * 100) : 0

  return {
    totalIncome,
    totalExpenses,
    totalBalance,
    netSavings,
    savingsRate,
  }
}

export function calculateMonthlyTrendData(transactions: Transaction[]): MonthlyTrendPoint[] {
  const monthlyMap = new Map<string, { income: number; expenses: number }>()

  transactions.filter(isCompletedTransaction).forEach((transaction) => {
    const month = transaction.date.slice(0, 7)
    const entry = monthlyMap.get(month) ?? { income: 0, expenses: 0 }

    if (transaction.type === 'income') {
      entry.income += transaction.amount
    } else {
      entry.expenses += transaction.amount
    }

    monthlyMap.set(month, entry)
  })

  return [...monthlyMap.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([month, values]) => ({
      month,
      income: values.income,
      expenses: values.expenses,
      balance: values.income - values.expenses,
    }))
}

export function calculateCategoryTotals(transactions: Transaction[]): CategoryTotal[] {
  const completedExpenses = transactions.filter(
    (transaction) => isCompletedTransaction(transaction) && transaction.type === 'expense',
  )
  const totalExpenses = completedExpenses.reduce((sum, transaction) => sum + transaction.amount, 0)

  return transactionCategories
    .map((category) => {
      const categoryTransactions = completedExpenses.filter((transaction) => transaction.category === category)
      const amount = categoryTransactions.reduce((sum, transaction) => sum + transaction.amount, 0)
      const percentage = totalExpenses > 0 ? roundToTwo((amount / totalExpenses) * 100) : 0

      return {
        category,
        amount,
        percentage,
        count: categoryTransactions.length,
      }
    })
    .filter((entry) => entry.amount > 0)
    .sort((left, right) => right.amount - left.amount)
}

export function calculateInsightsData(transactions: Transaction[]): InsightItem[] {
  const totals = calculateDashboardTotals(transactions)
  const categoryTotals = calculateCategoryTotals(transactions)
  const monthlyTrend = calculateMonthlyTrendData(transactions)
  const latestMonth = monthlyTrend[monthlyTrend.length - 1]
  const previousMonth = monthlyTrend[monthlyTrend.length - 2]
  const topCategory = categoryTotals[0]
  const pendingCount = transactions.filter((transaction) => transaction.status === 'pending').length
  const failedCount = transactions.filter((transaction) => transaction.status === 'failed').length
  const balanceChange = latestMonth && previousMonth ? latestMonth.balance - previousMonth.balance : 0

  const insights: InsightItem[] = []

  if (topCategory) {
    insights.push({
      id: 'top-spend-category',
      title: 'Top spending category',
      description: `${topCategory.category} is currently the largest expense bucket by completed spend.`,
      tone: topCategory.percentage > 25 ? 'warning' : 'neutral',
      value: topCategory.amount,
    })
  }

  insights.push({
    id: 'savings-rate',
    title: 'Savings rate',
    description:
      totals.savingsRate >= 35
        ? 'Savings discipline is strong relative to realized income.'
        : 'Savings rate has room to improve based on current expense levels.',
    tone: totals.savingsRate >= 35 ? 'positive' : 'warning',
    value: totals.savingsRate,
  })

  insights.push({
    id: 'monthly-balance-trend',
    title: 'Monthly balance momentum',
    description:
      balanceChange >= 0
        ? 'Latest realized monthly balance improved versus the prior month.'
        : 'Latest realized monthly balance softened versus the prior month.',
    tone: balanceChange >= 0 ? 'positive' : 'warning',
    value: balanceChange,
  })

  insights.push({
    id: 'processing-status',
    title: 'Processing watchlist',
    description: `${pendingCount} pending and ${failedCount} failed transactions may still affect final reporting.`,
    tone: pendingCount > 0 || failedCount > 0 ? 'warning' : 'neutral',
    value: pendingCount + failedCount,
  })

  return insights
}

export function selectDashboardTotals(state: Pick<DashboardStore, 'transactions' | 'filters'>) {
  return calculateDashboardTotals(selectFilteredTransactions(state))
}

export function selectTotalIncome(state: Pick<DashboardStore, 'transactions' | 'filters'>) {
  return selectDashboardTotals(state).totalIncome
}

export function selectTotalExpenses(state: Pick<DashboardStore, 'transactions' | 'filters'>) {
  return selectDashboardTotals(state).totalExpenses
}

export function selectTotalBalance(state: Pick<DashboardStore, 'transactions' | 'filters'>) {
  return selectDashboardTotals(state).totalBalance
}

export function selectNetSavings(state: Pick<DashboardStore, 'transactions' | 'filters'>) {
  return selectDashboardTotals(state).netSavings
}

export function selectSavingsRate(state: Pick<DashboardStore, 'transactions' | 'filters'>) {
  return selectDashboardTotals(state).savingsRate
}

export function selectMonthlyTrendData(state: Pick<DashboardStore, 'transactions' | 'filters'>) {
  return calculateMonthlyTrendData(selectFilteredTransactions(state))
}

export function selectCategoryTotals(state: Pick<DashboardStore, 'transactions' | 'filters'>) {
  return calculateCategoryTotals(selectFilteredTransactions(state))
}

export function selectInsightsData(state: Pick<DashboardStore, 'transactions' | 'filters'>) {
  return calculateInsightsData(selectFilteredTransactions(state))
}

export function hasActiveFilters(filters: TransactionFilters) {
  return (
    filters.search.trim().length > 0 ||
    filters.categories.length > 0 ||
    filters.paymentMethods.length > 0 ||
    filters.statuses.length > 0 ||
    filters.types.length > 0 ||
    Boolean(filters.startDate) ||
    Boolean(filters.endDate)
  )
}
