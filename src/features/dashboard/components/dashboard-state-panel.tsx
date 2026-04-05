import type { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

type DashboardStatePanelProps = {
  eyebrow?: string
  title: string
  description: string
  icon?: ReactNode
  action?: ReactNode
  className?: string
}

export function DashboardStatePanel({
  eyebrow,
  title,
  description,
  icon,
  action,
  className,
}: DashboardStatePanelProps) {
  return (
    <div
      className={cn(
        'flex min-h-[280px] flex-col items-center justify-center rounded-[24px] border border-dashed border-line bg-[linear-gradient(180deg,var(--surface-elevated),var(--surface-panel))] px-6 py-8 text-center shadow-panel',
        className,
      )}
    >
      {icon ? (
        <div className="flex h-16 w-16 items-center justify-center rounded-[20px] border border-line bg-[var(--surface-soft)] text-text-muted shadow-panel">
          {icon}
        </div>
      ) : null}
      {eyebrow ? (
        <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.28em] text-text-subtle">{eyebrow}</p>
      ) : null}
      <h3 className="mt-2 font-display text-2xl font-bold tracking-[-0.03em] text-text">{title}</h3>
      <p className="mt-3 max-w-xl text-sm leading-6 text-text-muted">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
}
