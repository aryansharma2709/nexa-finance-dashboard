import type { AnalyticsRange, BalanceTrendPoint, SpendingBreakdownItem } from '@/features/dashboard/types'
import { calculateCategoryTotals } from '@/store/dashboard-selectors'
import type { Transaction, TransactionCategory } from '@/features/finance/types'

const rangeDaysMap: Record<AnalyticsRange, number> = {
  '7D': 7,
  '30D': 30,
  '6M': 183,
  '1Y': 365,
}

const categoryColorMap: Record<TransactionCategory, string> = {
  Salary: '#63F5AE',
  Food: '#60A5FA',
  Shopping: '#A78BFA',
  Transport: '#FBBF24',
  Bills: '#F97316',
  Entertainment: '#FB7185',
  Health: '#34D399',
  Travel: '#38BDF8',
  Subscriptions: '#F472B6',
  Other: '#94A3B8',
}

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10)
}

function formatDayLabel(dateKey: string) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(dateKey))
}

function formatMonthLabel(monthKey: string) {
  const [year, month] = monthKey.split('-')

  return new Intl.DateTimeFormat('en-IN', {
    month: 'short',
    year: '2-digit',
  }).format(new Date(Number(year), Number(month) - 1, 1))
}

export function filterTransactionsByRange(transactions: Transaction[], range: AnalyticsRange) {
  if (transactions.length === 0) {
    return []
  }

  const latestTimestamp = Math.max(...transactions.map((transaction) => new Date(transaction.date).getTime()))
  const startTimestamp = latestTimestamp - (rangeDaysMap[range] - 1) * 24 * 60 * 60 * 1000

  return transactions.filter((transaction) => {
    const transactionTimestamp = new Date(transaction.date).getTime()
    return transactionTimestamp >= startTimestamp && transactionTimestamp <= latestTimestamp
  })
}

export function buildBalanceTrendData(
  transactions: Transaction[],
  range: AnalyticsRange,
): BalanceTrendPoint[] {
  if (transactions.length === 0) {
    return []
  }

  const isShortRange = range === '7D' || range === '30D'
  const grouped = new Map<string, { income: number; expenses: number }>()

  transactions
    .filter((transaction) => transaction.status === 'completed')
    .forEach((transaction) => {
      const key = isShortRange ? transaction.date : transaction.date.slice(0, 7)
      const bucket = grouped.get(key) ?? { income: 0, expenses: 0 }

      if (transaction.type === 'income') {
        bucket.income += transaction.amount
      } else {
        bucket.expenses += transaction.amount
      }

      grouped.set(key, bucket)
    })

  return [...grouped.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => ({
      label: isShortRange ? formatDayLabel(key) : formatMonthLabel(key),
      income: value.income,
      expenses: value.expenses,
      balance: value.income - value.expenses,
    }))
}

export function buildSpendingBreakdownData(
  transactions: Transaction[],
  activeCategories: TransactionCategory[],
): SpendingBreakdownItem[] {
  return calculateCategoryTotals(transactions).map((item) => ({
    category: item.category,
    amount: item.amount,
    percentage: item.percentage,
    color: categoryColorMap[item.category],
    active: activeCategories.length === 0 || activeCategories.includes(item.category),
  }))
}

export function getRangeStartDate(referenceDate: string, range: AnalyticsRange) {
  const baseDate = new Date(referenceDate)
  const startDate = new Date(baseDate.getTime() - (rangeDaysMap[range] - 1) * 24 * 60 * 60 * 1000)
  return toDateKey(startDate)
}
