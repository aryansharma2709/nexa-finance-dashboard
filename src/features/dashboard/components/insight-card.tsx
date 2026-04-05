import { motion } from 'motion/react'
import type { DashboardInsightCard } from '@/features/dashboard/types'
import { cn } from '@/lib/utils/cn'

type InsightCardProps = {
  item: DashboardInsightCard
}

export function InsightCard({ item }: InsightCardProps) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="rounded-[24px] border border-line bg-[linear-gradient(180deg,var(--surface-elevated),var(--surface-panel))] p-5 shadow-panel backdrop-blur-xl"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-text-muted">{item.title}</p>
        {item.badge ? (
          <span
            className={cn(
              'inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]',
              item.tone === 'positive' &&
                'border-[rgba(99,245,174,0.18)] bg-[rgba(99,245,174,0.1)] text-accent',
              item.tone === 'negative' &&
                'border-[rgba(251,113,133,0.18)] bg-[rgba(251,113,133,0.1)] text-[rgba(251,113,133,0.92)]',
              item.tone === 'neutral' &&
                'border-line bg-[rgba(255,255,255,0.03)] text-text-muted',
            )}
          >
            {item.badge}
          </span>
        ) : null}
      </div>

      <h3 className="mt-5 font-display text-[1.8rem] font-bold tracking-[-0.04em] text-text">{item.headline}</h3>
      <p className="mt-3 text-sm leading-6 text-text-muted">{item.description}</p>
    </motion.article>
  )
}
