import { useEffect, useState, useTransition } from 'react'
import { getInsights, getTransactions } from '@/features/finance/api/finance-api'
import type { InsightsData, Transaction } from '@/features/finance/types'
import { useDashboardStore } from '@/store/dashboard-store'

type QueryState<T> = {
  data: T | null
  error: string | null
  isLoading: boolean
  isPending: boolean
  refetch: () => Promise<void>
}

export function useTransactionsQuery(): QueryState<Transaction[]> {
  const setTransactions = useDashboardStore((state) => state.setTransactions)
  const [data, setData] = useState<Transaction[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  const refetch = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await getTransactions()
      startTransition(() => {
        setTransactions(response.data)
        setData(response.data)
      })
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : 'Unable to fetch transactions.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void refetch()
  }, [])

  return {
    data,
    error,
    isLoading,
    isPending,
    refetch,
  }
}

export function useInsightsQuery(): QueryState<InsightsData> {
  const [data, setData] = useState<InsightsData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  const refetch = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await getInsights()
      startTransition(() => {
        setData(response.data)
      })
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : 'Unable to fetch insights.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void refetch()
  }, [])

  return {
    data,
    error,
    isLoading,
    isPending,
    refetch,
  }
}
