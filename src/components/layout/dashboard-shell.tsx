import { motion } from 'motion/react'
import { LayoutContent } from '@/components/layout/layout-content'
import { LayoutSidebar } from '@/components/layout/layout-sidebar'
import { LayoutTopbar } from '@/components/layout/layout-topbar'
import { DashboardShellPage } from '@/features/dashboard/pages/dashboard-shell-page'

export function DashboardShell() {
  return (
    <div className="min-h-screen bg-canvas text-text">
      <div className="relative min-h-screen overflow-hidden bg-hero-grid [background-size:80px_80px]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(99,245,174,0.09),_transparent_24%),radial-gradient(circle_at_88%_12%,_rgba(96,165,250,0.06),_transparent_18%),linear-gradient(180deg,var(--overlay-start),var(--overlay-end))]" />
        <div className="pointer-events-none absolute -left-20 top-12 h-72 w-72 rounded-full bg-[rgba(99,245,174,0.05)] blur-[120px]" />
        <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-[rgba(96,165,250,0.04)] blur-[120px]" />

        <div className="relative mx-auto flex min-h-screen max-w-[1680px] gap-4 p-4 lg:gap-6 lg:p-6">
          <LayoutSidebar />
          <div className="flex min-h-[calc(100vh-2rem)] min-w-0 flex-1 flex-col rounded-[32px] border border-line bg-[var(--surface-shell)] shadow-panel backdrop-blur-sm lg:min-h-[calc(100vh-3rem)]">
            <LayoutTopbar />
            <LayoutContent>
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <DashboardShellPage />
              </motion.div>
            </LayoutContent>
          </div>
        </div>
      </div>
    </div>
  )
}
