import { motion } from 'motion/react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ChartCard } from '@/features/dashboard/components/chart-card'
import { ChartEmptyState } from '@/features/dashboard/components/chart-empty-state'
import { ChartLoadingState } from '@/features/dashboard/components/chart-loading-state'
import { ChartTooltip } from '@/features/dashboard/components/chart-tooltip'
import type { AnalyticsRange, BalanceTrendPoint } from '@/features/dashboard/types'
import { cn } from '@/lib/utils/cn'

const ranges: AnalyticsRange[] = ['7D', '30D', '6M', '1Y']

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
    notation: value >= 100000 ? 'compact' : 'standard',
  }).format(value)
}

type BalanceTrendCardProps = {
  data: BalanceTrendPoint[]
  activeRange: AnalyticsRange
  onRangeChange: (range: AnalyticsRange) => void
  isLoading: boolean
  isEmpty: boolean
}

export function BalanceTrendCard({
  data,
  activeRange,
  onRangeChange,
  isLoading,
  isEmpty,
}: BalanceTrendCardProps) {
  return (
    <ChartCard
      title="Balance Trend"
      description="A premium view of realized balance movement over the selected range, sourced from the shared finance state."
      actions={
        <div className="flex flex-wrap gap-2">
          {ranges.map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => onRangeChange(range)}
              className={cn(
                'rounded-full border px-3.5 py-2 text-xs font-semibold tracking-[0.16em] transition',
                activeRange === range
                  ? 'border-[rgba(99,245,174,0.18)] bg-[rgba(99,245,174,0.12)] text-accent'
                  : 'border-line bg-[rgba(255,255,255,0.03)] text-text-muted hover:border-line-strong hover:text-text',
              )}
            >
              {range}
            </button>
          ))}
        </div>
      }
    >
      {isLoading ? (
        <ChartLoadingState />
      ) : isEmpty ? (
        <ChartEmptyState
          eyebrow="Trend Gap"
          title="Balance trend needs more history"
          message="No balance trend data is available for the selected range yet. Broaden the range or load more transaction history through the mock API."
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="h-[320px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="balance-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="rgba(99,245,174,0.34)" />
                  <stop offset="100%" stopColor="rgba(99,245,174,0.02)" />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(166,173,187,0.72)', fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(166,173,187,0.72)', fontSize: 12 }}
                tickFormatter={(value: number) => formatCurrency(value)}
                width={88}
              />
              <Tooltip
                cursor={{ stroke: 'rgba(99,245,174,0.22)', strokeWidth: 1 }}
                content={({ active, payload, label }) => {
                  if (!active || !payload || payload.length === 0) {
                    return null
                  }

                  const point = payload[0]?.payload as BalanceTrendPoint

                  return (
                    <ChartTooltip
                      label={String(label)}
                      rows={[
                        { label: 'Balance', value: formatCurrency(point.balance), color: '#63F5AE' },
                        { label: 'Income', value: formatCurrency(point.income), color: '#60A5FA' },
                        { label: 'Expenses', value: formatCurrency(point.expenses), color: '#FB7185' },
                      ]}
                    />
                  )
                }}
              />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="#63F5AE"
                strokeWidth={2.5}
                fill="url(#balance-fill)"
                animationDuration={650}
                dot={false}
                activeDot={{ r: 4, fill: '#63F5AE', stroke: '#09090B', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      )}
    </ChartCard>
  )
}
