import { AppProviders } from '@/app/providers'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { useThemeEffect } from '@/features/theme/use-theme-effect'

export function App() {
  useThemeEffect()

  return (
    <AppProviders>
      <DashboardShell />
    </AppProviders>
  )
}
