import { motion } from 'motion/react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { ChartCard } from '@/features/dashboard/components/chart-card'
import { ChartEmptyState } from '@/features/dashboard/components/chart-empty-state'
import { ChartLoadingState } from '@/features/dashboard/components/chart-loading-state'
import { ChartTooltip } from '@/features/dashboard/components/chart-tooltip'
import type { SpendingBreakdownItem } from '@/features/dashboard/types'
import type { TransactionCategory } from '@/features/finance/types'
import { cn } from '@/lib/utils/cn'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
    notation: value >= 100000 ? 'compact' : 'standard',
  }).format(value)
}

type SpendingBreakdownCardProps = {
  data: SpendingBreakdownItem[]
  activeCategories: TransactionCategory[]
  onCategoryClick: (category: TransactionCategory) => void
  isLoading: boolean
  isEmpty: boolean
}

export function SpendingBreakdownCard({
  data,
  activeCategories,
  onCategoryClick,
  isLoading,
  isEmpty,
}: SpendingBreakdownCardProps) {
  return (
    <ChartCard
      title="Spending Breakdown"
      description="Category-wise completed expense totals across the active range. Clicking a category syncs the shared dashboard filter state."
    >
      {isLoading ? (
        <ChartLoadingState showLegend />
      ) : isEmpty ? (
        <ChartEmptyState
          eyebrow="Breakdown Gap"
          title="No category breakdown yet"
          message="No completed expense categories are available for the selected range. Adjust the range or filters to restore the spending split."
        />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,300px)_minmax(0,1fr)] xl:items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="h-[280px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="amount"
                  nameKey="category"
                  innerRadius={72}
                  outerRadius={104}
                  paddingAngle={3}
                  stroke="rgba(9,9,11,0.85)"
                  strokeWidth={4}
                  animationDuration={650}
                >
                  {data.map((entry) => (
                    <Cell key={entry.category} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || payload.length === 0) {
                      return null
                    }

                    const item = payload[0]?.payload as SpendingBreakdownItem

                    return (
                      <ChartTooltip
                        label={item.category}
                        rows={[
                          { label: 'Amount', value: formatCurrency(item.amount), color: item.color },
                          { label: 'Share', value: `${item.percentage}%`, color: item.color },
                        ]}
                      />
                    )
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          <div className="space-y-3">
            {data.map((item) => {
              const isActive = activeCategories.length === 0 || activeCategories.includes(item.category as TransactionCategory)

              return (
                <button
                  key={item.category}
                  type="button"
                  onClick={() => onCategoryClick(item.category as TransactionCategory)}
                  className={cn(
                    'flex w-full items-center justify-between gap-4 rounded-[18px] border px-4 py-3 text-left transition',
                    isActive
                      ? 'border-line-strong bg-[rgba(255,255,255,0.04)]'
                      : 'border-line bg-[rgba(255,255,255,0.02)] opacity-75 hover:opacity-100',
                  )}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-text">{item.category}</p>
                      <p className="text-xs uppercase tracking-[0.2em] text-text-subtle">{item.percentage}% share</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-text">{formatCurrency(item.amount)}</p>
                    <p className="text-xs text-text-muted">{isActive ? 'Included' : 'Filtered out'}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </ChartCard>
  )
}
