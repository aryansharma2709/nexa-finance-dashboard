import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { flexRender as tanstackFlexRender, type Row, type Table } from '@tanstack/react-table'
import { TransactionsEmptyState } from '@/features/dashboard/components/transactions-empty-state'
import type { Transaction } from '@/features/finance/types'
import { cn } from '@/lib/utils/cn'

type TransactionsTableProps = {
  table: Table<Transaction>
  rows: Row<Transaction>[]
  flexRender: typeof tanstackFlexRender
  hasActiveFilters: boolean
  onResetFilters: () => void
}

function SortingIcon({ sorted }: { sorted: false | 'asc' | 'desc' }) {
  if (sorted === 'asc') {
    return <ArrowUp size={14} />
  }

  if (sorted === 'desc') {
    return <ArrowDown size={14} />
  }

  return <ArrowUpDown size={14} />
}

export function TransactionsTable({
  table,
  rows,
  flexRender,
  hasActiveFilters,
  onResetFilters,
}: TransactionsTableProps) {
  if (rows.length === 0) {
    return <TransactionsEmptyState hasFilters={hasActiveFilters} onReset={onResetFilters} />
  }

  return (
    <div className="overflow-hidden rounded-[24px] border border-line bg-[var(--surface-panel)] shadow-panel">
      <div className="border-b border-line px-4 py-3 text-xs uppercase tracking-[0.24em] text-text-subtle md:hidden">
        Swipe for full table or use the mobile transaction cards below.
      </div>

      <div className="space-y-3 p-3 md:hidden">
        {rows.map((row) => {
          const dateCell = row.getVisibleCells().find((cell) => cell.column.id === 'date')
          const merchantCell = row.getVisibleCells().find((cell) => cell.column.id === 'merchant')
          const amountCell = row.getVisibleCells().find((cell) => cell.column.id === 'amount')
          const statusCell = row.getVisibleCells().find((cell) => cell.column.id === 'status')
          const categoryCell = row.getVisibleCells().find((cell) => cell.column.id === 'category')
          const paymentCell = row.getVisibleCells().find((cell) => cell.column.id === 'paymentMethod')
          const typeCell = row.getVisibleCells().find((cell) => cell.column.id === 'type')
          const actionsCell = row.getVisibleCells().find((cell) => cell.column.id === 'actions')

          return (
            <article key={row.id} className="rounded-[20px] border border-line bg-[var(--surface-elevated)] p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  {merchantCell ? flexRender(merchantCell.column.columnDef.cell, merchantCell.getContext()) : null}
                </div>
                <div className="shrink-0">
                  {amountCell ? flexRender(amountCell.column.columnDef.cell, amountCell.getContext()) : null}
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {statusCell ? flexRender(statusCell.column.columnDef.cell, statusCell.getContext()) : null}
                {categoryCell ? flexRender(categoryCell.column.columnDef.cell, categoryCell.getContext()) : null}
              </div>
              <div className="mt-4 grid gap-3 rounded-[18px] border border-line bg-[var(--surface-soft)] p-3 text-sm text-text-muted">
                <div className="flex items-center justify-between gap-3">
                  <span>Date</span>
                  <span className="text-right text-text">
                    {dateCell ? flexRender(dateCell.column.columnDef.cell, dateCell.getContext()) : null}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Type</span>
                  <span className="text-right">
                    {typeCell ? flexRender(typeCell.column.columnDef.cell, typeCell.getContext()) : null}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Payment</span>
                  <span className="text-right text-text">
                    {paymentCell ? flexRender(paymentCell.column.columnDef.cell, paymentCell.getContext()) : null}
                  </span>
                </div>
              </div>
              {actionsCell ? (
                <div className="mt-4 flex justify-end">
                  {flexRender(actionsCell.column.columnDef.cell, actionsCell.getContext())}
                </div>
              ) : null}
            </article>
          )
        })}
      </div>

      <div className="hidden max-w-full overflow-x-auto md:block">
        <table className="w-full min-w-[980px] border-collapse xl:min-w-[1080px]">
          <thead className="sticky top-0 z-10 bg-[var(--surface-panel)] backdrop-blur-xl">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-line">
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort()
                  const sorted = header.column.getIsSorted()

                  return (
                    <th
                      key={header.id}
                      className={cn(
                        'px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-text-subtle',
                        header.column.id === 'amount' || header.column.id === 'actions' ? 'text-right' : '',
                      )}
                    >
                      {header.isPlaceholder ? null : canSort ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className="inline-flex items-center gap-2"
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          <SortingIcon sorted={sorted} />
                        </button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-line last:border-none hover:bg-[rgba(255,255,255,0.02)]">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={cn(
                      'px-4 py-4 align-middle',
                      cell.column.id === 'amount' || cell.column.id === 'actions' ? 'text-right' : '',
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
