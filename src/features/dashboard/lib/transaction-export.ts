import Papa from 'papaparse'
import type { Transaction, TransactionFilters } from '@/features/finance/types'
import { hasActiveFilters } from '@/store/dashboard-selectors'

export type TransactionExportFormat = 'json' | 'csv'

type TransactionExportRow = {
  Date: string
  Merchant: string
  Description: string
  Category: string
  Type: string
  'Payment Method': string
  Status: string
  Amount: number
  Notes: string
}

function formatDateStamp(date: Date) {
  return date.toISOString().slice(0, 10)
}

function sanitizeSegment(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function compactList(values: readonly string[]) {
  if (values.length === 0) {
    return null
  }

  if (values.length === 1) {
    return sanitizeSegment(values[0])
  }

  return `${sanitizeSegment(values[0])}-plus-${values.length - 1}`
}

function buildFilterContext(filters: TransactionFilters) {
  if (!hasActiveFilters(filters)) {
    return 'all'
  }

  const segments = [
    filters.categories.length > 0 ? `category-${compactList(filters.categories)}` : null,
    filters.types.length > 0 ? `type-${compactList(filters.types)}` : null,
    filters.paymentMethods.length > 0 ? `payment-${compactList(filters.paymentMethods)}` : null,
    filters.statuses.length > 0 ? `status-${compactList(filters.statuses)}` : null,
    filters.search.trim() ? `search-${sanitizeSegment(filters.search).slice(0, 18)}` : null,
    filters.startDate || filters.endDate
      ? `range-${sanitizeSegment(filters.startDate ?? 'start')}-to-${sanitizeSegment(filters.endDate ?? 'now')}`
      : null,
  ].filter((segment): segment is string => Boolean(segment))

  const context = segments.slice(0, 3).join('-')
  return context || 'filtered'
}

function mapTransactionsForExport(transactions: Transaction[]): TransactionExportRow[] {
  return transactions.map((transaction) => ({
    Date: transaction.date,
    Merchant: transaction.merchant,
    Description: transaction.description,
    Category: transaction.category,
    Type: transaction.type,
    'Payment Method': transaction.paymentMethod,
    Status: transaction.status,
    Amount: transaction.amount,
    Notes: transaction.notes ?? '',
  }))
}

function createBlob(content: string, type: string) {
  return new Blob([content], { type })
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = filename
  link.click()

  URL.revokeObjectURL(url)
}

export function buildTransactionExportFilename(
  filters: TransactionFilters,
  format: TransactionExportFormat,
  date = new Date(),
  rowCount?: number,
) {
  const context = buildFilterContext(filters)
  const countSegment = typeof rowCount === 'number' && rowCount > 0 ? `-${rowCount}-rows` : ''
  return `transactions-${context}${countSegment}-${formatDateStamp(date)}.${format}`
}

export function exportTransactions(
  transactions: Transaction[],
  filters: TransactionFilters,
  format: TransactionExportFormat,
) {
  const exportRows = mapTransactionsForExport(transactions)
  const filename = buildTransactionExportFilename(filters, format, new Date(), exportRows.length)

  if (format === 'json') {
    const json = JSON.stringify(exportRows, null, 2)
    downloadBlob(createBlob(json, 'application/json;charset=utf-8'), filename)
    return filename
  }

  const csv = Papa.unparse(exportRows)
  downloadBlob(createBlob(csv, 'text/csv;charset=utf-8'), filename)
  return filename
}
