import { useState } from 'react'
import { toast } from 'sonner'
import { createTransaction, deleteTransaction, updateTransaction } from '@/features/finance/api/finance-api'
import type { Transaction } from '@/features/finance/types'
import {
  createTransactionFormValues,
  normalizeTransactionPayload,
  type TransactionFormValues,
  validateTransactionForm,
} from '@/features/dashboard/components/transaction-form-modal'

type ModalMode = 'create' | 'edit'

function resolveActionError(action: 'create' | 'update' | 'delete', merchant?: string, error?: unknown) {
  const fallbackAction =
    action === 'create'
      ? 'create the transaction'
      : action === 'update'
        ? `save changes for ${merchant ?? 'this transaction'}`
        : `delete ${merchant ?? 'this transaction'}`

  const detail = error instanceof Error ? error.message.trim() : ''
  return detail ? `Could not ${fallbackAction}. ${detail}` : `Could not ${fallbackAction}. Please try again.`
}

export function useTransactionAdmin(refetch: () => Promise<void>) {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<ModalMode>('create')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [values, setValues] = useState<TransactionFormValues>(createTransactionFormValues())
  const [errors, setErrors] = useState<Partial<Record<keyof TransactionFormValues, string>>>({})

  function openCreate() {
    setMode('create')
    setSelectedTransaction(null)
    setValues(createTransactionFormValues())
    setErrors({})
    setIsOpen(true)
  }

  function openEdit(transaction: Transaction) {
    setMode('edit')
    setSelectedTransaction(transaction)
    setValues(createTransactionFormValues(transaction))
    setErrors({})
    setIsOpen(true)
  }

  function closeModal() {
    if (!isSubmitting) {
      setIsOpen(false)
      setErrors({})
    }
  }

  function updateField<K extends keyof TransactionFormValues>(field: K, value: TransactionFormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  async function submit() {
    const nextErrors = validateTransactionForm(values)
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      toast.error('Please correct the highlighted transaction fields.')
      return
    }

    setIsSubmitting(true)
    try {
      const payload = normalizeTransactionPayload(values)
      if (mode === 'create') {
        await createTransaction(payload)
        toast.success('Transaction created successfully.')
      } else if (selectedTransaction) {
        await updateTransaction(selectedTransaction.id, payload)
        toast.success(`Saved changes for ${selectedTransaction.merchant}.`)
      }
      await refetch()
      setIsOpen(false)
    } catch (error) {
      toast.error(resolveActionError(mode === 'create' ? 'create' : 'update', selectedTransaction?.merchant, error))
    } finally {
      setIsSubmitting(false)
    }
  }

  async function remove(transaction: Transaction) {
    const shouldDelete = window.confirm(`Delete ${transaction.merchant} from transactions?`)
    if (!shouldDelete) {
      return
    }

    setIsSubmitting(true)
    try {
      await deleteTransaction(transaction.id)
      await refetch()
      toast.success(`${transaction.merchant} was deleted successfully.`)
    } catch (error) {
      toast.error(resolveActionError('delete', transaction.merchant, error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    isOpen,
    mode,
    values,
    errors,
    selectedTransaction,
    isSubmitting,
    openCreate,
    openEdit,
    closeModal,
    updateField,
    submit,
    remove,
  }
}
