import { DatabaseZap } from 'lucide-react'
import { DashboardStatePanel } from '@/features/dashboard/components/dashboard-state-panel'

type ChartEmptyStateProps = {
  message: string
  title?: string
  eyebrow?: string
}

export function ChartEmptyState({ message, title = 'No chart data yet', eyebrow = 'Data Gap' }: ChartEmptyStateProps) {
  return (
    <DashboardStatePanel
      eyebrow={eyebrow}
      title={title}
      description={message}
      icon={<DatabaseZap size={24} />}
      className="min-h-[280px] rounded-[20px]"
    />
  )
}
