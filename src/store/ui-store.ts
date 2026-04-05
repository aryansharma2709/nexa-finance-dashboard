import { create } from 'zustand'

export const dashboardSectionIds = [
  'dashboard',
  'transactions',
  'analytics',
  'insights',
  'export',
  'settings',
] as const

export type DashboardSectionId = (typeof dashboardSectionIds)[number]

type UiStore = {
  isSidebarCollapsed: boolean
  isMobileSidebarOpen: boolean
  activeSection: DashboardSectionId
  toggleSidebar: () => void
  openMobileSidebar: () => void
  closeMobileSidebar: () => void
  setActiveSection: (section: DashboardSectionId) => void
}

export const useUiStore = create<UiStore>((set) => ({
  isSidebarCollapsed: false,
  isMobileSidebarOpen: false,
  activeSection: 'dashboard',
  toggleSidebar: () =>
    set((state) => ({
      isSidebarCollapsed: !state.isSidebarCollapsed,
    })),
  openMobileSidebar: () =>
    set(() => ({
      isMobileSidebarOpen: true,
    })),
  closeMobileSidebar: () =>
    set(() => ({
      isMobileSidebarOpen: false,
    })),
  setActiveSection: (activeSection) =>
    set(() => ({
      activeSection,
    })),
}))
