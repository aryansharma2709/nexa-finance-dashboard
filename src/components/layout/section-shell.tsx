import type { PropsWithChildren } from 'react'
import { cn } from '@/lib/utils/cn'

type SectionShellProps = PropsWithChildren<{
  className?: string
  title: string
  description?: string
  sectionId?: string
}>

export function SectionShell({ className, title, description, sectionId, children }: SectionShellProps) {
  return (
    <section
      id={sectionId}
      className={cn(
        'scroll-mt-36 rounded-[24px] border border-line bg-[var(--surface-panel)] p-5 shadow-panel backdrop-blur-lg lg:p-6',
        className,
      )}
    >
      <div>
        <h2 className="font-display text-xl font-bold tracking-[-0.02em] text-text">{title}</h2>
        {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-text-muted">{description}</p> : null}
      </div>
      {children ? <div className="mt-6">{children}</div> : null}
    </section>
  )
}
