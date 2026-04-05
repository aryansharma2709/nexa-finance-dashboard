import type { PropsWithChildren, ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

type ChartCardProps = PropsWithChildren<{
  title: string
  description: string
  actions?: ReactNode
  className?: string
}>

export function ChartCard({ title, description, actions, className, children }: ChartCardProps) {
  return (
    <section
      className={cn(
        'rounded-[24px] border border-line bg-[linear-gradient(180deg,var(--surface-elevated),var(--surface-panel))] p-5 shadow-panel backdrop-blur-xl lg:p-6',
        className,
      )}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-[-0.03em] text-text">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-text-muted">{description}</p>
        </div>
        {actions}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  )
}
