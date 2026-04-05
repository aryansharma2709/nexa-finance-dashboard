import { useEffect } from 'react'
import { useDashboardStore } from '@/store/dashboard-store'

export function useThemeEffect() {
  const theme = useDashboardStore((state) => state.theme)

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    root.style.colorScheme = theme
  }, [theme])

  return {
    theme,
  }
}
