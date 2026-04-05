import type { LucideIcon } from 'lucide-react'

export type KpiDeltaTone = 'positive' | 'negative' | 'neutral'

export type DashboardSummaryItem = {
  key: 'totalBalance' | 'income' | 'expenses' | 'netSavings' | 'savingsRate'
  label: string
  value: number
  format: 'currency' | 'percentage'
  delta: number
  deltaLabel: string
  deltaTone: KpiDeltaTone
  icon: LucideIcon
  trend: number[]
}

export type AnalyticsRange = '7D' | '30D' | '6M' | '1Y'

export type BalanceTrendPoint = {
  label: string
  balance: number
  income: number
  expenses: number
}

export type SpendingBreakdownItem = {
  category: string
  amount: number
  percentage: number
  color: string
  active: boolean
}

export type DashboardInsightCard = {
  key:
    | 'highestSpendingCategory'
    | 'biggestExpenseThisMonth'
    | 'monthlyExpenseComparison'
    | 'recurringSubscriptions'
    | 'savingsRateInsight'
  title: string
  headline: string
  description: string
  badge?: string
  tone: KpiDeltaTone
}
