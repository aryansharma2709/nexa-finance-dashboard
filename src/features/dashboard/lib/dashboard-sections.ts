import type { DashboardSectionId } from '@/store/ui-store'

export type DashboardSectionDefinition = {
  id: DashboardSectionId
  label: string
  description: string
  aliases: string[]
}

export const dashboardSections: readonly DashboardSectionDefinition[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    description: 'Jump to the KPI overview and top-level summary cards.',
    aliases: ['dashboard', 'overview', 'summary', 'home'],
  },
  {
    id: 'transactions',
    label: 'Transactions',
    description: 'Open the filtered transaction ledger and controls.',
    aliases: ['transactions', 'transaction', 'activity', 'table', 'ledger'],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    description: 'Scroll to charts, trends, and category breakdowns.',
    aliases: ['analytics', 'analysis', 'charts', 'trend', 'breakdown'],
  },
  {
    id: 'insights',
    label: 'Insights',
    description: 'View narrative signals and financial observations.',
    aliases: ['insights', 'signals', 'observations', 'recommendations'],
  },
  {
    id: 'export',
    label: 'Export',
    description: 'Go to the export panel for filtered CSV and JSON downloads.',
    aliases: ['export', 'downloads', 'download', 'csv', 'json'],
  },
  {
    id: 'settings',
    label: 'Settings',
    description: 'Move to shell preferences, theme, and role guidance.',
    aliases: ['settings', 'preferences', 'theme', 'roles', 'admin', 'viewer'],
  },
] as const

function normalizeQuery(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, ' ')
}

export function getDashboardSectionById(sectionId: DashboardSectionId) {
  return dashboardSections.find((section) => section.id === sectionId) ?? dashboardSections[0]
}

export function findDashboardSectionMatch(query: string) {
  const normalizedQuery = normalizeQuery(query)

  if (!normalizedQuery) {
    return null
  }

  const exactMatch = dashboardSections.find((section) =>
    [section.label.toLowerCase(), ...section.aliases].some((alias) => alias === normalizedQuery),
  )

  if (exactMatch) {
    return exactMatch
  }

  if (normalizedQuery.length < 3) {
    return null
  }

  return (
    dashboardSections.find((section) =>
      [section.label.toLowerCase(), ...section.aliases].some(
        (alias) => alias.startsWith(normalizedQuery) || normalizedQuery.includes(alias),
      ),
    ) ?? null
  )
}

export function scrollToDashboardSection(sectionId: DashboardSectionId) {
  const resolvedSectionId =
    sectionId === 'export' ? 'transactions' : sectionId === 'settings' ? 'dashboard' : sectionId

  const element = document.getElementById(resolvedSectionId)

  if (!element) {
    return false
  }

  element.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })

  return true
}
