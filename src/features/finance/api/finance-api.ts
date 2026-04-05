import type {
  CreateTransactionRequest,
  DeleteTransactionResponse,
  InsightsResponse,
  TransactionResponse,
  TransactionsResponse,
  UpdateTransactionRequest,
} from '@/features/finance/api/types'

type ApiOptions = {
  fail?: boolean
  signal?: AbortSignal
}

async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Request failed with status ${response.status}`)
  }

  return (await response.json()) as T
}

function withFailureParam(path: string, fail?: boolean) {
  if (!fail) {
    return path
  }

  const separator = path.includes('?') ? '&' : '?'
  return `${path}${separator}fail=true`
}

export async function getTransactions(options: ApiOptions = {}) {
  const response = await fetch(withFailureParam('/api/transactions', options.fail), {
    method: 'GET',
    signal: options.signal,
  })

  return parseJson<TransactionsResponse>(response)
}

export async function createTransaction(payload: CreateTransactionRequest, options: ApiOptions = {}) {
  const response = await fetch(withFailureParam('/api/transactions', options.fail), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    signal: options.signal,
  })

  return parseJson<TransactionResponse>(response)
}

export async function updateTransaction(
  transactionId: string,
  payload: UpdateTransactionRequest,
  options: ApiOptions = {},
) {
  const response = await fetch(withFailureParam(`/api/transactions/${transactionId}`, options.fail), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    signal: options.signal,
  })

  return parseJson<TransactionResponse>(response)
}

export async function deleteTransaction(transactionId: string, options: ApiOptions = {}) {
  const response = await fetch(withFailureParam(`/api/transactions/${transactionId}`, options.fail), {
    method: 'DELETE',
    signal: options.signal,
  })

  return parseJson<DeleteTransactionResponse>(response)
}

export async function getInsights(options: ApiOptions = {}) {
  const response = await fetch(withFailureParam('/api/insights', options.fail), {
    method: 'GET',
    signal: options.signal,
  })

  return parseJson<InsightsResponse>(response)
}
