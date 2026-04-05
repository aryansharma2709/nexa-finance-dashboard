import {
  appThemes,
  paymentMethods,
  transactionCategories,
  transactionKinds,
  transactionStatuses,
  userRoles,
  type AppTheme,
  type PaymentMethod,
  type Transaction,
  type TransactionCategory,
  type TransactionFilters,
  type TransactionKind,
  type TransactionStatus,
  type UserRole,
} from '@/features/finance/types'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isStringArray<T extends string>(value: unknown, allowed: readonly T[]): value is T[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string' && allowed.includes(item as T))
}

function isNullableDate(value: unknown) {
  return value === null || typeof value === 'string'
}

export function isTransactionCategory(value: unknown): value is TransactionCategory {
  return typeof value === 'string' && transactionCategories.includes(value as TransactionCategory)
}

export function isPaymentMethod(value: unknown): value is PaymentMethod {
  return typeof value === 'string' && paymentMethods.includes(value as PaymentMethod)
}

export function isTransactionKind(value: unknown): value is TransactionKind {
  return typeof value === 'string' && transactionKinds.includes(value as TransactionKind)
}

export function isTransactionStatus(value: unknown): value is TransactionStatus {
  return typeof value === 'string' && transactionStatuses.includes(value as TransactionStatus)
}

export function isUserRole(value: unknown): value is UserRole {
  return typeof value === 'string' && userRoles.includes(value as UserRole)
}

export function isAppTheme(value: unknown): value is AppTheme {
  return typeof value === 'string' && appThemes.includes(value as AppTheme)
}

export function isTransaction(value: unknown): value is Transaction {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.id === 'string' &&
    typeof value.date === 'string' &&
    typeof value.description === 'string' &&
    typeof value.merchant === 'string' &&
    typeof value.amount === 'number' &&
    Number.isFinite(value.amount) &&
    isTransactionKind(value.type) &&
    isTransactionCategory(value.category) &&
    isPaymentMethod(value.paymentMethod) &&
    isTransactionStatus(value.status) &&
    (value.notes === undefined || typeof value.notes === 'string')
  )
}

export function isTransactionFilters(value: unknown): value is TransactionFilters {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.search === 'string' &&
    isStringArray(value.categories, transactionCategories) &&
    isStringArray(value.paymentMethods, paymentMethods) &&
    isStringArray(value.statuses, transactionStatuses) &&
    isStringArray(value.types, transactionKinds) &&
    isNullableDate(value.startDate) &&
    isNullableDate(value.endDate)
  )
}
