import type {
  CreateTransactionInput,
  InsightsData,
  Transaction,
  UpdateTransactionInput,
} from '@/features/finance/types'

export type TransactionsResponse = {
  data: Transaction[]
}

export type TransactionResponse = {
  data: Transaction
}

export type InsightsResponse = {
  data: InsightsData
}

export type DeleteTransactionResponse = {
  data: {
    id: string
  }
}

export type CreateTransactionRequest = CreateTransactionInput

export type UpdateTransactionRequest = UpdateTransactionInput
