import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'
import {
  paymentMethods,
  transactionCategories,
  transactionKinds,
  transactionStatuses,
  type CreateTransactionInput,
  type Transaction,
} from '@/features/finance/types'

export type TransactionFormValues = {
  date: string
  merchant: string
  description: string
  amount: string
  type: CreateTransactionInput['type']
  category: CreateTransactionInput['category']
  paymentMethod: CreateTransactionInput['paymentMethod']
  status: CreateTransactionInput['status']
  notes: string
}

type TransactionFormModalProps = {
  open: boolean
  mode: 'create' | 'edit'
  values: TransactionFormValues
  errors: Partial<Record<keyof TransactionFormValues, string>>
  transaction?: Transaction | null
  isSubmitting: boolean
  onClose: () => void
  onChange: <K extends keyof TransactionFormValues>(field: K, value: TransactionFormValues[K]) => void
  onSubmit: () => void
}

function FieldLabel({ children }: { children: string }) {
  return <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-text-subtle">{children}</span>
}

function InputError({ message }: { message?: string }) {
  return message ? <p className="mt-2 text-xs text-[rgba(251,113,133,0.92)]">{message}</p> : null
}

export function createTransactionFormValues(transaction?: Transaction | null): TransactionFormValues {
  return {
    date: transaction?.date ?? '',
    merchant: transaction?.merchant ?? '',
    description: transaction?.description ?? '',
    amount: transaction ? String(transaction.amount) : '',
    type: transaction?.type ?? 'expense',
    category: transaction?.category ?? 'Food',
    paymentMethod: transaction?.paymentMethod ?? 'Card',
    status: transaction?.status ?? 'completed',
    notes: transaction?.notes ?? '',
  }
}

export function normalizeTransactionPayload(values: TransactionFormValues): CreateTransactionInput {
  return {
    date: values.date,
    merchant: values.merchant.trim(),
    description: values.description.trim(),
    amount: Number(values.amount),
    type: values.type,
    category: values.category,
    paymentMethod: values.paymentMethod,
    status: values.status,
    notes: values.notes.trim() || undefined,
  }
}

export function validateTransactionForm(values: TransactionFormValues) {
  const errors: Partial<Record<keyof TransactionFormValues, string>> = {}

  if (!values.date) {
    errors.date = 'Date is required.'
  }
  if (!values.merchant.trim()) {
    errors.merchant = 'Merchant is required.'
  }
  if (!values.description.trim()) {
    errors.description = 'Description is required.'
  }
  if (!values.amount.trim()) {
    errors.amount = 'Amount is required.'
  } else if (Number.isNaN(Number(values.amount)) || Number(values.amount) <= 0) {
    errors.amount = 'Amount must be greater than 0.'
  }

  return errors
}

export function TransactionFormModal({
  open,
  mode,
  values,
  errors,
  transaction,
  isSubmitting,
  onClose,
  onChange,
  onSubmit,
}: TransactionFormModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null)
  const firstInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!open) {
      return
    }

    firstInputRef.current?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab' || !modalRef.current) {
        return
      }

      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])',
      )

      if (focusableElements.length === 0) {
        return
      }

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm"
        >
          <button type="button" aria-label="Close modal overlay" className="absolute inset-0" onClick={onClose} />
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="relative z-10 max-h-[min(92vh,840px)] w-full max-w-3xl overflow-y-auto rounded-[30px] border border-line bg-[linear-gradient(180deg,var(--surface-elevated),var(--surface-panel))] p-6 shadow-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="transaction-modal-title"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-text-subtle">
                  {mode === 'create' ? 'Admin Create' : 'Admin Edit'}
                </p>
                <h2 id="transaction-modal-title" className="mt-2 font-display text-3xl font-bold tracking-[-0.03em] text-text">
                  {mode === 'create' ? 'Add Transaction' : `Edit ${transaction?.merchant ?? 'Transaction'}`}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-11 w-11 items-center justify-center rounded-[18px] border border-line bg-[rgba(255,255,255,0.03)] text-text-muted transition hover:border-line-strong hover:text-text"
                aria-label="Close transaction modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <FieldLabel>Date</FieldLabel>
                <input ref={firstInputRef} type="date" value={values.date} onChange={(e) => onChange('date', e.target.value)} className="h-12 w-full rounded-[18px] border border-line bg-[var(--surface-soft)] px-4 text-sm text-text outline-none transition focus:border-[rgba(99,245,174,0.3)]" />
                <InputError message={errors.date} />
              </div>
              <div>
                <FieldLabel>Amount</FieldLabel>
                <input type="number" min="0" step="0.01" value={values.amount} onChange={(e) => onChange('amount', e.target.value)} className="h-12 w-full rounded-[18px] border border-line bg-[var(--surface-soft)] px-4 text-sm text-text outline-none transition focus:border-[rgba(99,245,174,0.3)]" placeholder="0.00" />
                <InputError message={errors.amount} />
              </div>
              <div>
                <FieldLabel>Merchant</FieldLabel>
                <input type="text" value={values.merchant} onChange={(e) => onChange('merchant', e.target.value)} className="h-12 w-full rounded-[18px] border border-line bg-[var(--surface-soft)] px-4 text-sm text-text outline-none transition focus:border-[rgba(99,245,174,0.3)]" placeholder="Merchant name" />
                <InputError message={errors.merchant} />
              </div>
              <div>
                <FieldLabel>Description</FieldLabel>
                <input type="text" value={values.description} onChange={(e) => onChange('description', e.target.value)} className="h-12 w-full rounded-[18px] border border-line bg-[var(--surface-soft)] px-4 text-sm text-text outline-none transition focus:border-[rgba(99,245,174,0.3)]" placeholder="What happened" />
                <InputError message={errors.description} />
              </div>
              <div>
                <FieldLabel>Type</FieldLabel>
                <select value={values.type} onChange={(e) => onChange('type', e.target.value as TransactionFormValues['type'])} className="h-12 w-full rounded-[18px] border border-line bg-[var(--surface-soft)] px-4 text-sm text-text outline-none transition focus:border-[rgba(99,245,174,0.3)]">
                  {transactionKinds.map((option) => (
                    <option key={option} value={option} className="bg-[#12151B]">{option === 'income' ? 'Income' : 'Expense'}</option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel>Category</FieldLabel>
                <select value={values.category} onChange={(e) => onChange('category', e.target.value as TransactionFormValues['category'])} className="h-12 w-full rounded-[18px] border border-line bg-[var(--surface-soft)] px-4 text-sm text-text outline-none transition focus:border-[rgba(99,245,174,0.3)]">
                  {transactionCategories.map((option) => (
                    <option key={option} value={option} className="bg-[#12151B]">{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel>Payment Method</FieldLabel>
                <select value={values.paymentMethod} onChange={(e) => onChange('paymentMethod', e.target.value as TransactionFormValues['paymentMethod'])} className="h-12 w-full rounded-[18px] border border-line bg-[var(--surface-soft)] px-4 text-sm text-text outline-none transition focus:border-[rgba(99,245,174,0.3)]">
                  {paymentMethods.map((option) => (
                    <option key={option} value={option} className="bg-[#12151B]">{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel>Status</FieldLabel>
                <select value={values.status} onChange={(e) => onChange('status', e.target.value as TransactionFormValues['status'])} className="h-12 w-full rounded-[18px] border border-line bg-[var(--surface-soft)] px-4 text-sm text-text outline-none transition focus:border-[rgba(99,245,174,0.3)]">
                  {transactionStatuses.map((option) => (
                    <option key={option} value={option} className="bg-[#12151B]">{option}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-5">
              <FieldLabel>Notes</FieldLabel>
              <textarea rows={4} value={values.notes} onChange={(e) => onChange('notes', e.target.value)} className="w-full rounded-[18px] border border-line bg-[var(--surface-soft)] px-4 py-3 text-sm text-text outline-none transition focus:border-[rgba(99,245,174,0.3)]" placeholder="Optional context" />
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={onClose} className="inline-flex h-12 items-center justify-center rounded-[18px] border border-line bg-[rgba(255,255,255,0.03)] px-5 text-sm text-text-muted transition hover:border-line-strong hover:text-text">
                Cancel
              </button>
              <button type="button" onClick={onSubmit} disabled={isSubmitting} className="inline-flex h-12 items-center justify-center rounded-[18px] border border-[rgba(99,245,174,0.18)] bg-[rgba(99,245,174,0.12)] px-5 text-sm font-medium text-accent transition disabled:cursor-not-allowed disabled:opacity-60">
                {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Transaction' : 'Save Changes'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
