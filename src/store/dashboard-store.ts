import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { seedTransactions } from '@/features/finance/data/seed-transactions'
import type {
  AppTheme,
  Transaction,
  TransactionCategory,
  TransactionFilters,
  TransactionKind,
  TransactionStatus,
  PaymentMethod,
  UserRole,
} from '@/features/finance/types'
import {
  isAppTheme,
  isTransaction,
  isTransactionFilters,
  isUserRole,
} from '@/features/finance/utils/validators'
import { createSafePersistStorage } from '@/lib/storage/persist-storage'

export const defaultFilters: TransactionFilters = {
  search: '',
  categories: [],
  paymentMethods: [],
  statuses: [],
  types: [],
  startDate: null,
  endDate: null,
}

type TransactionsSlice = {
  transactions: Transaction[]
  setTransactions: (transactions: Transaction[]) => void
  addTransaction: (transaction: Transaction) => void
  updateTransaction: (transactionId: string, updates: Partial<Transaction>) => void
  removeTransaction: (transactionId: string) => void
}

type FiltersSlice = {
  filters: TransactionFilters
  setSearch: (search: string) => void
  setDateRange: (startDate: string | null, endDate: string | null) => void
  setCategories: (categories: TransactionCategory[]) => void
  setPaymentMethods: (paymentMethods: PaymentMethod[]) => void
  setStatuses: (statuses: TransactionStatus[]) => void
  setTypes: (types: TransactionKind[]) => void
  resetFilters: () => void
}

type RoleSlice = {
  role: UserRole
  setRole: (role: UserRole) => void
}

type PreferencesSlice = {
  theme: AppTheme
  setTheme: (theme: AppTheme) => void
}

export type DashboardStore = TransactionsSlice & FiltersSlice & RoleSlice & PreferencesSlice

type PersistedDashboardState = Pick<DashboardStore, 'transactions' | 'filters' | 'role' | 'theme'>

function sanitizePersistedState(value: unknown): Partial<PersistedDashboardState> {
  if (!value || typeof value !== 'object') {
    return {}
  }

  const candidate = value as Partial<Record<keyof PersistedDashboardState, unknown>>

  return {
    transactions:
      Array.isArray(candidate.transactions) && candidate.transactions.every(isTransaction)
        ? candidate.transactions
        : seedTransactions,
    filters: isTransactionFilters(candidate.filters) ? candidate.filters : defaultFilters,
    role: isUserRole(candidate.role) ? candidate.role : 'Viewer',
    theme: isAppTheme(candidate.theme) ? candidate.theme : 'dark',
  }
}

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set) => ({
      transactions: seedTransactions,
      setTransactions: (transactions) => set({ transactions }),
      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [transaction, ...state.transactions],
        })),
      updateTransaction: (transactionId, updates) =>
        set((state) => ({
          transactions: state.transactions.map((transaction) =>
            transaction.id === transactionId ? { ...transaction, ...updates } : transaction,
          ),
        })),
      removeTransaction: (transactionId) =>
        set((state) => ({
          transactions: state.transactions.filter((transaction) => transaction.id !== transactionId),
        })),
      filters: defaultFilters,
      setSearch: (search) =>
        set((state) => ({
          filters: {
            ...state.filters,
            search,
          },
        })),
      setDateRange: (startDate, endDate) =>
        set((state) => ({
          filters: {
            ...state.filters,
            startDate,
            endDate,
          },
        })),
      setCategories: (categories) =>
        set((state) => ({
          filters: {
            ...state.filters,
            categories,
          },
        })),
      setPaymentMethods: (paymentMethods) =>
        set((state) => ({
          filters: {
            ...state.filters,
            paymentMethods,
          },
        })),
      setStatuses: (statuses) =>
        set((state) => ({
          filters: {
            ...state.filters,
            statuses,
          },
        })),
      setTypes: (types) =>
        set((state) => ({
          filters: {
            ...state.filters,
            types,
          },
        })),
      resetFilters: () => set({ filters: defaultFilters }),
      role: 'Viewer',
      setRole: (role) => set({ role }),
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'nexa-dashboard-store',
      storage: createSafePersistStorage<PersistedDashboardState>('nexa-dashboard-store'),
      partialize: (state) => ({
        transactions: state.transactions,
        filters: state.filters,
        role: state.role,
        theme: state.theme,
      }),
      merge: (persistedState, currentState) => {
        const safeState = sanitizePersistedState(persistedState)

        return {
          ...currentState,
          ...safeState,
        }
      },
    },
  ),
)
