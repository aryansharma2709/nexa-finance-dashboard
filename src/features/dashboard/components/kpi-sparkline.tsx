import { cn } from '@/lib/utils/cn'

type KpiSparklineProps = {
  data: number[]
  tone: 'positive' | 'negative' | 'neutral'
}

function buildPoints(data: number[]) {
  if (data.length === 0) {
    return ''
  }

  const width = 100
  const height = 40
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  return data
    .map((value, index) => {
      const x = (index / Math.max(data.length - 1, 1)) * width
      const y = height - ((value - min) / range) * height
      return `${x},${y}`
    })
    .join(' ')
}

export function KpiSparkline({ data, tone }: KpiSparklineProps) {
  const points = buildPoints(data)

  return (
    <div className="relative h-14 w-full overflow-hidden rounded-[18px] border border-line bg-[rgba(255,255,255,0.02)]">
      <div
        className={cn(
          'absolute inset-0',
          tone === 'positive' && 'bg-[radial-gradient(circle_at_center,_rgba(99,245,174,0.12),_transparent_70%)]',
          tone === 'negative' && 'bg-[radial-gradient(circle_at_center,_rgba(251,113,133,0.1),_transparent_70%)]',
          tone === 'neutral' && 'bg-[radial-gradient(circle_at_center,_rgba(96,165,250,0.08),_transparent_70%)]',
        )}
      />
      <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="relative h-full w-full px-2 py-2">
        <polyline
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
        <polyline
          fill="none"
          stroke={
            tone === 'positive'
              ? 'rgba(99,245,174,0.95)'
              : tone === 'negative'
                ? 'rgba(251,113,133,0.95)'
                : 'rgba(96,165,250,0.9)'
          }
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    </div>
  )
}
