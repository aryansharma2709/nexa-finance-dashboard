export const transactionKinds = ['income', 'expense'] as const
export const transactionCategories = [
  'Salary',
  'Food',
  'Shopping',
  'Transport',
  'Bills',
  'Entertainment',
  'Health',
  'Travel',
  'Subscriptions',
  'Other',
] as const
export const paymentMethods = ['Card', 'UPI', 'Bank Transfer', 'Cash'] as const
export const transactionStatuses = ['completed', 'pending', 'failed'] as const
export const userRoles = ['Viewer', 'Admin'] as const
export const appThemes = ['dark', 'light'] as const

export type TransactionKind = (typeof transactionKinds)[number]
export type TransactionCategory = (typeof transactionCategories)[number]
export type PaymentMethod = (typeof paymentMethods)[number]
export type TransactionStatus = (typeof transactionStatuses)[number]
export type UserRole = (typeof userRoles)[number]
export type AppTheme = (typeof appThemes)[number]

export type Transaction = {
  id: string
  date: string
  description: string
  merchant: string
  amount: number
  type: TransactionKind
  category: TransactionCategory
  paymentMethod: PaymentMethod
  status: TransactionStatus
  notes?: string
}

export type TransactionFilters = {
  search: string
  categories: TransactionCategory[]
  paymentMethods: PaymentMethod[]
  statuses: TransactionStatus[]
  types: TransactionKind[]
  startDate: string | null
  endDate: string | null
}

export type DashboardTotals = {
  totalIncome: number
  totalExpenses: number
  totalBalance: number
  netSavings: number
  savingsRate: number
}

export type MonthlyTrendPoint = {
  month: string
  income: number
  expenses: number
  balance: number
}

export type CategoryTotal = {
  category: TransactionCategory
  amount: number
  percentage: number
  count: number
}

export type InsightTone = 'positive' | 'neutral' | 'warning'

export type InsightItem = {
  id: string
  title: string
  description: string
  tone: InsightTone
  value: number
}

export type InsightsData = {
  totals: DashboardTotals
  monthlyTrend: MonthlyTrendPoint[]
  categoryTotals: CategoryTotal[]
  insights: InsightItem[]
}

export type CreateTransactionInput = Omit<Transaction, 'id'>

export type UpdateTransactionInput = Partial<Omit<Transaction, 'id'>>
