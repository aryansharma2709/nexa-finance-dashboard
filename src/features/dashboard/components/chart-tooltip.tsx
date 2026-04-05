import { cn } from '@/lib/utils/cn'

type TooltipRow = {
  color: string
  label: string
  value: string
}

type ChartTooltipProps = {
  label?: string
  rows: TooltipRow[]
}

export function ChartTooltip({ label, rows }: ChartTooltipProps) {
  return (
    <div className="min-w-[180px] rounded-[18px] border border-line bg-[rgba(15,17,21,0.96)] p-4 shadow-panel backdrop-blur-xl">
      {label ? <p className="text-xs uppercase tracking-[0.24em] text-text-subtle">{label}</p> : null}
      <div className={cn('space-y-2', label && 'mt-3')}>
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-2 text-text-muted">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: row.color }} />
              <span>{row.label}</span>
            </div>
            <span className="font-medium text-text">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
