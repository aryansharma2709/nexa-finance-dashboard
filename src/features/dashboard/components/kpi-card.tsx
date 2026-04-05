import { motion } from 'motion/react'
import { cn } from '@/lib/utils/cn'
import type { DashboardSummaryItem } from '@/features/dashboard/types'
import { KpiSparkline } from '@/features/dashboard/components/kpi-sparkline'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatPercentage(value: number) {
  return `${value.toFixed(1)}%`
}

type KpiCardProps = {
  item: DashboardSummaryItem
}

export function KpiCard({ item }: KpiCardProps) {
  const Icon = item.icon

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="group rounded-[24px] border border-line bg-[linear-gradient(180deg,var(--surface-elevated),var(--surface-panel))] p-5 shadow-panel backdrop-blur-xl"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-text-muted">{item.label}</p>
          <h3 className="mt-3 font-display text-3xl font-bold tracking-[-0.04em] text-text xl:text-[2rem]">
            {item.format === 'currency' ? formatCurrency(item.value) : formatPercentage(item.value)}
          </h3>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-[18px] border border-line bg-[rgba(255,255,255,0.03)] text-accent shadow-glow">
          <Icon size={20} />
        </div>
      </div>

      <div className="mt-5">
        <KpiSparkline data={item.trend} tone={item.deltaTone} />
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span
          className={cn(
            'inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold tracking-[0.12em]',
            item.deltaTone === 'positive' &&
              'border-[rgba(99,245,174,0.18)] bg-[rgba(99,245,174,0.1)] text-accent',
            item.deltaTone === 'negative' &&
              'border-[rgba(251,113,133,0.18)] bg-[rgba(251,113,133,0.1)] text-[rgba(251,113,133,0.92)]',
            item.deltaTone === 'neutral' &&
              'border-[rgba(96,165,250,0.18)] bg-[rgba(96,165,250,0.1)] text-[rgba(147,197,253,0.92)]',
          )}
        >
          {item.deltaLabel}
        </span>
        <p className="text-xs uppercase tracking-[0.24em] text-text-subtle">vs previous month</p>
      </div>
    </motion.article>
  )
}
