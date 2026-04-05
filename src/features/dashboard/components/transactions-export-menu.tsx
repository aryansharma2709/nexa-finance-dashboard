import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { ChevronDown, Download } from 'lucide-react'
import { toast } from 'sonner'
import type { Transaction, TransactionFilters } from '@/features/finance/types'
import { exportTransactions, type TransactionExportFormat } from '@/features/dashboard/lib/transaction-export'
import { cn } from '@/lib/utils/cn'

type TransactionsExportMenuProps = {
  transactions: Transaction[]
  filters: TransactionFilters
}

type ExportOption = {
  format: TransactionExportFormat
  label: string
  description: string
}

const exportOptions: ExportOption[] = [
  {
    format: 'csv',
    label: 'Export CSV',
    description: 'Spreadsheet-friendly transaction export',
  },
  {
    format: 'json',
    label: 'Export JSON',
    description: 'Structured transaction export for tooling',
  },
]

export function TransactionsExportMenu({ transactions, filters }: TransactionsExportMenuProps) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([])
  const isDisabled = transactions.length === 0

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handlePointerDown)
    }

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
    }
  }, [open])

  useEffect(() => {
    if (!open) {
      return
    }

    optionRefs.current[0]?.focus()
  }, [open])

  function handleExport(format: TransactionExportFormat) {
    if (isDisabled) {
      toast.error('No filtered transactions are available to export yet.')
      return
    }

    const filename = exportTransactions(transactions, filters, format)
    toast.success(`Exported ${transactions.length} filtered rows: ${filename}`)
    setOpen(false)
    buttonRef.current?.focus()
  }

  function handleMenuKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.preventDefault()
      setOpen(false)
      buttonRef.current?.focus()
      return
    }

    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') {
      return
    }

    event.preventDefault()

    const activeIndex = optionRefs.current.findIndex((item) => item === document.activeElement)
    const direction = event.key === 'ArrowDown' ? 1 : -1
    const nextIndex =
      activeIndex === -1
        ? 0
        : (activeIndex + direction + exportOptions.length) % exportOptions.length

    optionRefs.current[nextIndex]?.focus()
  }

  return (
    <div ref={menuRef} className="relative w-full sm:w-auto" onKeyDown={handleMenuKeyDown}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((current) => !current)}
        disabled={isDisabled}
        title={isDisabled ? 'No transactions match the current filters' : 'Export current transactions'}
        className={cn(
          'inline-flex h-11 w-full items-center justify-center gap-2 rounded-[18px] border px-4 text-sm font-medium transition sm:w-auto',
          isDisabled
            ? 'cursor-not-allowed border-line bg-[var(--surface-soft)] text-text-subtle'
            : 'border-line bg-[var(--surface-soft)] text-text-muted hover:border-line-strong hover:text-text',
        )}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="transactions-export-menu"
      >
        <Download size={16} />
        Export
        <ChevronDown size={16} className={cn('transition', open ? 'rotate-180' : '')} />
      </button>

      {open ? (
        <div
          id="transactions-export-menu"
          role="menu"
          className="absolute left-0 right-0 top-[calc(100%+0.75rem)] z-20 min-w-[260px] rounded-[22px] border border-line bg-[var(--surface-elevated)] p-2 shadow-panel backdrop-blur-xl sm:left-auto"
        >
          {exportOptions.map((option, index) => (
            <button
              key={option.format}
              ref={(element) => {
                optionRefs.current[index] = element
              }}
              type="button"
              onClick={() => handleExport(option.format)}
              role="menuitem"
              className="flex w-full flex-col rounded-[18px] px-4 py-3 text-left transition hover:bg-[rgba(255,255,255,0.04)] focus-visible:bg-[rgba(255,255,255,0.04)]"
            >
              <span className="text-sm font-medium text-text">{option.label}</span>
              <span className="mt-1 text-xs leading-5 text-text-muted">{option.description}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
