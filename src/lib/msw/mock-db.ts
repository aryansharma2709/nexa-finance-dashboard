import { useDashboardStore } from '@/store/dashboard-store'

export function getDashboardStoreState() {
  return useDashboardStore.getState()
}
