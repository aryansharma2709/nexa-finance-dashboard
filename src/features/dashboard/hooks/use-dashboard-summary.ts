import {
  ArrowDownCircle,
  ArrowUpCircle,
  PiggyBank,
  Scale,
  Wallet,
} from 'lucide-react'
import { useInsightsQuery } from '@/features/finance/api/use-finance-queries'
import type { DashboardSummaryItem, KpiDeltaTone } from '@/features/dashboard/types'

function roundToTwo(value: number) {
  return Number(value.toFixed(2))
}

function calculatePercentageChange(current: number, previous: number) {
  if (previous === 0) {
    return null
  }

  return roundToTwo(((current - previous) / previous) * 100)
}

function resolveDeltaTone(value: number, inverse = false): KpiDeltaTone {
  if (value === 0) {
    return 'neutral'
  }

  if (inverse) {
    return value < 0 ? 'positive' : 'negative'
  }

  return value > 0 ? 'positive' : 'negative'
}

function formatDelta(value: number, suffix = '%') {
  const absoluteValue = Math.abs(roundToTwo(value))
  return `${value >= 0 ? '+' : '-'}${absoluteValue}${suffix}`
}

function formatPercentageDelta(value: number | null) {
  if (value === null) {
    return 'New'
  }

  return formatDelta(value)
}

function buildTrendSeries(series: number[]) {
  if (series.length > 0) {
    return series
  }

  return [0, 0, 0, 0]
}

export function useDashboardSummary() {
  const query = useInsightsQuery()
  const summary = query.data

  const monthlyTrend = summary?.monthlyTrend ?? []
  const currentMonth = monthlyTrend[monthlyTrend.length - 1]
  const previousMonth = monthlyTrend[monthlyTrend.length - 2]

  const currentIncome = currentMonth?.income ?? 0
  const previousIncome = previousMonth?.income ?? 0
  const currentExpenses = currentMonth?.expenses ?? 0
  const previousExpenses = previousMonth?.expenses ?? 0
  const currentBalance = currentMonth?.balance ?? 0
  const previousBalance = previousMonth?.balance ?? 0
  const balanceDelta = calculatePercentageChange(currentBalance, previousBalance)
  const incomeDelta = calculatePercentageChange(currentIncome, previousIncome)
  const expensesDelta = calculatePercentageChange(currentExpenses, previousExpenses)
  const savingsDelta = calculatePercentageChange(currentBalance, previousBalance)
  const currentSavingsRate = currentIncome > 0 ? roundToTwo((currentBalance / currentIncome) * 100) : 0
  const previousSavingsRate = previousIncome > 0 ? roundToTwo((previousBalance / previousIncome) * 100) : 0
  const savingsRateDelta = roundToTwo(currentSavingsRate - previousSavingsRate)

  const items: DashboardSummaryItem[] = [
    {
      key: 'totalBalance',
      label: 'Total Balance',
      value: summary?.totals.totalBalance ?? 0,
      format: 'currency',
      delta: balanceDelta ?? 0,
      deltaLabel: formatPercentageDelta(balanceDelta),
      deltaTone: balanceDelta === null ? 'neutral' : resolveDeltaTone(balanceDelta),
      icon: Wallet,
      trend: buildTrendSeries(monthlyTrend.map((item) => item.balance)),
    },
    {
      key: 'income',
      label: 'Income',
      value: summary?.totals.totalIncome ?? 0,
      format: 'currency',
      delta: incomeDelta ?? 0,
      deltaLabel: formatPercentageDelta(incomeDelta),
      deltaTone: incomeDelta === null ? 'neutral' : resolveDeltaTone(incomeDelta),
      icon: ArrowUpCircle,
      trend: buildTrendSeries(monthlyTrend.map((item) => item.income)),
    },
    {
      key: 'expenses',
      label: 'Expenses',
      value: summary?.totals.totalExpenses ?? 0,
      format: 'currency',
      delta: expensesDelta ?? 0,
      deltaLabel: formatPercentageDelta(expensesDelta),
      deltaTone: expensesDelta === null ? 'neutral' : resolveDeltaTone(expensesDelta, true),
      icon: ArrowDownCircle,
      trend: buildTrendSeries(monthlyTrend.map((item) => item.expenses)),
    },
    {
      key: 'netSavings',
      label: 'Net Savings',
      value: summary?.totals.netSavings ?? 0,
      format: 'currency',
      delta: savingsDelta ?? 0,
      deltaLabel: formatPercentageDelta(savingsDelta),
      deltaTone: savingsDelta === null ? 'neutral' : resolveDeltaTone(savingsDelta),
      icon: PiggyBank,
      trend: buildTrendSeries(monthlyTrend.map((item) => item.income - item.expenses)),
    },
    {
      key: 'savingsRate',
      label: 'Savings Rate',
      value: summary?.totals.savingsRate ?? 0,
      format: 'percentage',
      delta: savingsRateDelta,
      deltaLabel: formatDelta(savingsRateDelta, ' pts'),
      deltaTone: resolveDeltaTone(savingsRateDelta),
      icon: Scale,
      trend: buildTrendSeries(
        monthlyTrend.map((item) => (item.income > 0 ? roundToTwo((item.balance / item.income) * 100) : 0)),
      ),
    },
  ]

  return {
    items,
    isEmpty: !summary || monthlyTrend.length === 0,
    isLoading: query.isLoading,
    isPending: query.isPending,
    error: query.error,
    refetch: query.refetch,
  }
}
