import {
  ArrowUpFromLine,
  BrainCircuit,
  ChartColumnIncreasing,
  LayoutDashboard,
  Settings,
  WalletCards,
  X,
} from 'lucide-react'
import { motion } from 'motion/react'
import { NexaWordmark } from '@/components/brand/nexa-wordmark'
import { dashboardSections, scrollToDashboardSection } from '@/features/dashboard/lib/dashboard-sections'
import { cn } from '@/lib/utils/cn'
import type { DashboardSectionId } from '@/store/ui-store'
import { useUiStore } from '@/store/ui-store'

type NavigationItem = {
  id: DashboardSectionId
  label: string
  icon: (typeof LayoutDashboard)
}

const navigationItems: NavigationItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: WalletCards },
  { id: 'analytics', label: 'Analytics', icon: ChartColumnIncreasing },
  { id: 'insights', label: 'Insights', icon: BrainCircuit },
  { id: 'export', label: 'Export', icon: ArrowUpFromLine },
  { id: 'settings', label: 'Settings', icon: Settings },
]

type SidebarPanelProps = {
  collapsed?: boolean
  onClose?: () => void
}

function SidebarPanel({ collapsed = false, onClose }: SidebarPanelProps) {
  const activeSection = useUiStore((state) => state.activeSection)

  function handleNavigation(sectionId: DashboardSectionId) {
    scrollToDashboardSection(sectionId)
    onClose?.()
  }

  return (
    <div
      className={cn(
        'flex h-full flex-col rounded-[32px] border border-line bg-[var(--surface-sidebar)] p-4 shadow-panel backdrop-blur-xl',
        collapsed ? 'w-[92px]' : 'w-[288px]',
      )}
    >
      <div className={cn('flex items-center', collapsed ? 'justify-center' : 'justify-between')}>
        {collapsed ? (
          <div className="flex h-14 w-14 items-center justify-center rounded-[20px] border border-line bg-[rgba(255,255,255,0.03)] font-display text-lg font-bold text-accent shadow-glow">
            N
          </div>
        ) : (
          <NexaWordmark />
        )}
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-[18px] border border-line bg-[rgba(255,255,255,0.03)] text-text-muted transition hover:border-line-strong hover:text-text"
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        ) : null}
      </div>

      <nav className="mt-8 space-y-2">
        {navigationItems.map(({ id, label, icon: Icon }) => (
          <button
            key={label}
            type="button"
            onClick={() => handleNavigation(id)}
            title={getNavigationDescription(id)}
            aria-current={activeSection === id ? 'page' : undefined}
            className={cn(
              'flex w-full items-center rounded-[20px] border px-4 py-3.5 text-left text-sm font-medium transition',
              activeSection === id
                ? 'border-[rgba(99,245,174,0.16)] bg-[rgba(99,245,174,0.1)] text-text shadow-glow'
                : 'border-transparent bg-transparent text-text-muted hover:border-line hover:bg-[rgba(255,255,255,0.03)] hover:text-text',
              collapsed ? 'justify-center' : 'gap-3',
            )}
          >
            <Icon size={18} className="shrink-0" />
            {!collapsed ? <span>{label}</span> : null}
          </button>
        ))}
      </nav>

      <div className="mt-auto rounded-[24px] border border-line bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-4">
        <p className={cn('text-[11px] font-semibold uppercase tracking-[0.32em] text-text-subtle', collapsed && 'text-center')}>
          Shell
        </p>
        {!collapsed ? (
          <>
            <p className="mt-3 font-display text-lg font-semibold text-text">Interaction ready</p>
            <p className="mt-2 text-sm leading-6 text-text-muted">
              Search and navigation now jump across real dashboard destinations for evaluator walkthroughs.
            </p>
          </>
        ) : null}
      </div>
    </div>
  )
}

function getNavigationDescription(sectionId: DashboardSectionId) {
  return dashboardSections.find((section) => section.id === sectionId)?.description ?? 'Jump to section'
}

export function LayoutSidebar() {
  const isSidebarCollapsed = useUiStore((state) => state.isSidebarCollapsed)
  const isMobileSidebarOpen = useUiStore((state) => state.isMobileSidebarOpen)
  const closeMobileSidebar = useUiStore((state) => state.closeMobileSidebar)

  return (
    <>
      <aside className="hidden shrink-0 xl:block">
        <SidebarPanel collapsed={isSidebarCollapsed} />
      </aside>

      {isMobileSidebarOpen ? (
        <div className="fixed inset-0 z-40 xl:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-label="Close navigation overlay"
            onClick={closeMobileSidebar}
          />
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
            className="relative h-full w-[min(88vw,320px)] p-4"
          >
            <SidebarPanel onClose={closeMobileSidebar} />
          </motion.div>
        </div>
      ) : null}
    </>
  )
}
