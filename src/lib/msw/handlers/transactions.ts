import { HttpResponse, http } from 'msw'
import type { CreateTransactionInput, Transaction, UpdateTransactionInput } from '@/features/finance/types'
import { isPaymentMethod, isTransaction, isTransactionCategory, isTransactionKind, isTransactionStatus } from '@/features/finance/utils/validators'
import { getDashboardStoreState } from '@/lib/msw/mock-db'
import { apiRoute } from '@/lib/msw/routes'
import { failIfRequested, maybeDelay } from '@/lib/msw/utils'

function createTransactionId() {
  return `txn-${crypto.randomUUID()}`
}

function isCreateTransactionInput(value: unknown): value is CreateTransactionInput {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Record<string, unknown>

  return (
    typeof candidate.date === 'string' &&
    typeof candidate.description === 'string' &&
    typeof candidate.merchant === 'string' &&
    typeof candidate.amount === 'number' &&
    Number.isFinite(candidate.amount) &&
    isTransactionKind(candidate.type) &&
    isTransactionCategory(candidate.category) &&
    isPaymentMethod(candidate.paymentMethod) &&
    isTransactionStatus(candidate.status) &&
    (candidate.notes === undefined || typeof candidate.notes === 'string')
  )
}

function isUpdateTransactionInput(value: unknown): value is UpdateTransactionInput {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Record<string, unknown>

  return (
    (candidate.date === undefined || typeof candidate.date === 'string') &&
    (candidate.description === undefined || typeof candidate.description === 'string') &&
    (candidate.merchant === undefined || typeof candidate.merchant === 'string') &&
    (candidate.amount === undefined || (typeof candidate.amount === 'number' && Number.isFinite(candidate.amount))) &&
    (candidate.type === undefined || isTransactionKind(candidate.type)) &&
    (candidate.category === undefined || isTransactionCategory(candidate.category)) &&
    (candidate.paymentMethod === undefined || isPaymentMethod(candidate.paymentMethod)) &&
    (candidate.status === undefined || isTransactionStatus(candidate.status)) &&
    (candidate.notes === undefined || typeof candidate.notes === 'string')
  )
}

export const transactionHandlers = [
  http.get(apiRoute('transactions'), async ({ request }) => {
    const failure = await failIfRequested(request, 'Failed to load transactions.')

    if (failure) {
      return failure
    }

    await maybeDelay()

    const { transactions } = getDashboardStoreState()

    return HttpResponse.json({
      data: transactions,
    })
  }),

  http.post(apiRoute('transactions'), async ({ request }) => {
    const failure = await failIfRequested(request, 'Failed to create transaction.')

    if (failure) {
      return failure
    }

    const payload = await request.json()

    if (!isCreateTransactionInput(payload)) {
      return HttpResponse.json(
        {
          message: 'Invalid transaction payload.',
        },
        {
          status: 400,
        },
      )
    }

    await maybeDelay()

    const nextTransaction: Transaction = {
      ...payload,
      id: createTransactionId(),
    }

    getDashboardStoreState().addTransaction(nextTransaction)

    return HttpResponse.json(
      {
        data: nextTransaction,
      },
      {
        status: 201,
      },
    )
  }),

  http.patch(apiRoute('transactions/:id'), async ({ params, request }) => {
    const failure = await failIfRequested(request, 'Failed to update transaction.')

    if (failure) {
      return failure
    }

    const transactionId = params.id

    if (typeof transactionId !== 'string') {
      return HttpResponse.json(
        {
          message: 'Transaction id is required.',
        },
        {
          status: 400,
        },
      )
    }

    const payload = await request.json()

    if (!isUpdateTransactionInput(payload)) {
      return HttpResponse.json(
        {
          message: 'Invalid transaction update payload.',
        },
        {
          status: 400,
        },
      )
    }

    const currentTransaction = getDashboardStoreState().transactions.find(
      (transaction) => transaction.id === transactionId,
    )

    if (!currentTransaction) {
      return HttpResponse.json(
        {
          message: 'Transaction not found.',
        },
        {
          status: 404,
        },
      )
    }

    await maybeDelay()

    const updatedTransaction = {
      ...currentTransaction,
      ...payload,
    }

    if (!isTransaction(updatedTransaction)) {
      return HttpResponse.json(
        {
          message: 'Updated transaction is invalid.',
        },
        {
          status: 400,
        },
      )
    }

    getDashboardStoreState().updateTransaction(transactionId, payload)

    return HttpResponse.json({
      data: updatedTransaction,
    })
  }),

  http.delete(apiRoute('transactions/:id'), async ({ params, request }) => {
    const failure = await failIfRequested(request, 'Failed to delete transaction.')

    if (failure) {
      return failure
    }

    const transactionId = params.id

    if (typeof transactionId !== 'string') {
      return HttpResponse.json(
        {
          message: 'Transaction id is required.',
        },
        {
          status: 400,
        },
      )
    }

    const existingTransaction = getDashboardStoreState().transactions.find(
      (transaction) => transaction.id === transactionId,
    )

    if (!existingTransaction) {
      return HttpResponse.json(
        {
          message: 'Transaction not found.',
        },
        {
          status: 404,
        },
      )
    }

    await maybeDelay()

    getDashboardStoreState().removeTransaction(transactionId)

    return HttpResponse.json({
      data: {
        id: transactionId,
      },
    })
  }),
] as const
