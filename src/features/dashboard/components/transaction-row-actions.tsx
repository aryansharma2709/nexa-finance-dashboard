import { Ban, Pencil, PlusCircle, Trash2 } from 'lucide-react'
import type { Transaction, UserRole } from '@/features/finance/types'

type TransactionRowActionsProps = {
  role: UserRole
  transaction: Transaction
  disabled?: boolean
  onEdit?: (transaction: Transaction) => void
  onDelete?: (transaction: Transaction) => void
}

export function TransactionRowActions({
  role,
  transaction,
  disabled = false,
  onEdit,
  onDelete,
}: TransactionRowActionsProps) {
  if (role === 'Viewer') {
    return (
      <div className="inline-flex flex-wrap items-center justify-end gap-2 rounded-[14px] border border-line bg-[var(--surface-soft)] px-3 py-2 text-xs font-medium text-text-muted">
        <Ban size={14} />
        Read only
        <span className="text-text-subtle">Viewer cannot edit</span>
      </div>
    )
  }

  return (
    <div className="inline-flex items-center gap-1 rounded-[14px] border border-line bg-[var(--surface-soft)] p-1">
      <button
        type="button"
        onClick={() => onEdit?.(transaction)}
        disabled={disabled}
        className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] text-text-muted transition hover:bg-[rgba(255,255,255,0.05)] hover:text-text disabled:cursor-not-allowed disabled:opacity-50"
        aria-label={`Edit ${transaction.merchant}`}
        title={`Edit ${transaction.merchant}`}
      >
        <Pencil size={14} />
      </button>
      <button
        type="button"
        onClick={() => onDelete?.(transaction)}
        disabled={disabled}
        className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] text-text-muted transition hover:bg-[rgba(255,255,255,0.05)] hover:text-[rgba(251,113,133,0.92)] disabled:cursor-not-allowed disabled:opacity-50"
        aria-label={`Delete ${transaction.merchant}`}
        title={`Delete ${transaction.merchant}`}
      >
        <Trash2 size={14} />
      </button>
      <button
        type="button"
        disabled
        className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] text-text-muted/60"
        aria-label={`Placeholder action for ${transaction.merchant}`}
      >
        <PlusCircle size={14} />
      </button>
    </div>
  )
}
