import type { TransactionStatus } from '@/features/finance/types'
import { cn } from '@/lib/utils/cn'

type TransactionStatusPillProps = {
  status: TransactionStatus
}

export function TransactionStatusPill({ status }: TransactionStatusPillProps) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]',
        status === 'completed' &&
          'border-[rgba(99,245,174,0.18)] bg-[rgba(99,245,174,0.1)] text-accent',
        status === 'pending' &&
          'border-[rgba(251,191,36,0.18)] bg-[rgba(251,191,36,0.1)] text-[rgba(251,191,36,0.92)]',
        status === 'failed' &&
          'border-[rgba(251,113,133,0.18)] bg-[rgba(251,113,133,0.1)] text-[rgba(251,113,133,0.92)]',
      )}
    >
      {status}
    </span>
  )
}
