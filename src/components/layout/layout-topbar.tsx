import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { CalendarRange, Menu, MoonStar, Search, SunMedium, UserRound } from 'lucide-react'
import { RoleSwitcher } from '@/features/dashboard/components/role-switcher'
import {
  findDashboardSectionMatch,
  getDashboardSectionById,
  scrollToDashboardSection,
} from '@/features/dashboard/lib/dashboard-sections'
import { useDashboardStore } from '@/store/dashboard-store'
import { useUiStore } from '@/store/ui-store'

const dateRanges = ['24H', '7D', '30D', 'YTD'] as const

function TopbarPill({ children, active = false }: { children: ReactNode; active?: boolean }) {
  return (
    <button
      type="button"
      className={
        active
          ? 'rounded-full border border-[rgba(99,245,174,0.16)] bg-[rgba(99,245,174,0.12)] px-4 py-2 text-xs font-semibold tracking-[0.16em] text-accent'
          : 'rounded-full border border-line bg-[rgba(255,255,255,0.03)] px-4 py-2 text-xs font-semibold tracking-[0.16em] text-text-muted transition hover:border-line-strong hover:text-text'
      }
    >
      {children}
    </button>
  )
}

export function LayoutTopbar() {
  const isSidebarCollapsed = useUiStore((state) => state.isSidebarCollapsed)
  const toggleSidebar = useUiStore((state) => state.toggleSidebar)
  const openMobileSidebar = useUiStore((state) => state.openMobileSidebar)
  const activeSection = useUiStore((state) => state.activeSection)
  const role = useDashboardStore((state) => state.role)
  const setRole = useDashboardStore((state) => state.setRole)
  const theme = useDashboardStore((state) => state.theme)
  const setTheme = useDashboardStore((state) => state.setTheme)
  const [searchValue, setSearchValue] = useState('')

  function toggleTheme() {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const matchedSection = useMemo(() => findDashboardSectionMatch(searchValue), [searchValue])

  useEffect(() => {
    const exactMatch = matchedSection

    if (!exactMatch) {
      return
    }

    const normalizedQuery = searchValue.trim().toLowerCase()
    const exactAliases = [exactMatch.label.toLowerCase(), ...exactMatch.aliases]

    if (exactAliases.includes(normalizedQuery)) {
      scrollToDashboardSection(exactMatch.id)
    }
  }, [matchedSection, searchValue])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextSection = matchedSection ?? getDashboardSectionById(activeSection)
    scrollToDashboardSection(nextSection.id)
  }

  return (
    <header className="sticky top-0 z-30 px-4 pb-4 pt-4 lg:px-6 lg:pt-6">
      <div className="flex flex-col gap-4 rounded-[28px] border border-line bg-[var(--surface-glass)] p-4 shadow-panel backdrop-blur-xl lg:p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={openMobileSidebar}
              className="inline-flex h-12 w-12 items-center justify-center rounded-[18px] border border-line bg-[rgba(255,255,255,0.03)] text-text xl:hidden"
              aria-label="Open navigation"
            >
              <Menu size={18} />
            </button>
            <button
              type="button"
              onClick={toggleSidebar}
              className="hidden h-12 items-center justify-center rounded-[18px] border border-line bg-[rgba(255,255,255,0.03)] px-4 text-sm font-medium text-text-muted transition hover:border-line-strong hover:text-text xl:inline-flex"
            >
              {isSidebarCollapsed ? 'Expand Nav' : 'Collapse Nav'}
            </button>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-text-subtle">
                Workspace
              </p>
              <h1 className="mt-1 font-display text-2xl font-bold tracking-[-0.03em] text-text">
                Nexa Finance
              </h1>
            </div>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex h-12 items-center gap-3 rounded-[18px] border border-line bg-[var(--surface-soft)] px-4 text-sm text-text-muted transition hover:border-line-strong hover:text-text"
            >
              {theme === 'dark' ? <MoonStar size={16} /> : <SunMedium size={16} />}
              <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
              <span className="rounded-full border border-line px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-text-subtle">
                Theme
              </span>
            </button>
            <div className="flex h-12 w-12 items-center justify-center rounded-[18px] border border-line bg-[var(--surface-elevated)] text-text">
              <UserRound size={18} />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <form onSubmit={handleSubmit} className="w-full xl:max-w-[460px]">
            <div className="flex h-14 w-full items-center gap-3 rounded-[20px] border border-line bg-[var(--surface-soft)] px-4 text-sm text-text-muted transition focus-within:border-[rgba(99,245,174,0.24)]">
              <Search size={18} className="text-text-subtle" />
              <input
                type="text"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search dashboard sections"
                className="w-full bg-transparent text-text outline-none placeholder:text-text-subtle"
                aria-label="Search dashboard sections"
              />
              <button
                type="submit"
                className="inline-flex h-9 items-center rounded-full border border-line bg-[var(--surface-elevated)] px-3 text-xs font-semibold uppercase tracking-[0.16em] text-text-muted transition hover:border-line-strong hover:text-text"
              >
                Go
              </button>
            </div>
            <p className="mt-2 px-1 text-xs text-text-subtle">
              {matchedSection
                ? `Press enter to jump to ${matchedSection.label}.`
                : 'Try dashboard, transactions, analytics, insights, export, or settings.'}
            </p>
          </form>

          <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:justify-end">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {dateRanges.map((range, index) => (
                <TopbarPill key={range} active={index === 2}>
                  {range}
                </TopbarPill>
              ))}
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-line bg-[rgba(255,255,255,0.03)] px-4 py-2 text-xs font-semibold tracking-[0.16em] text-text-muted transition hover:border-line-strong hover:text-text"
              >
                <CalendarRange size={14} />
                Date Range
              </button>
            </div>

            <RoleSwitcher role={role} onChange={setRole} />

            <div className="flex items-center gap-3 md:hidden">
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex h-12 items-center gap-3 rounded-[18px] border border-line bg-[var(--surface-soft)] px-4 text-sm text-text-muted"
              >
                {theme === 'dark' ? <MoonStar size={16} /> : <SunMedium size={16} />}
                <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
              </button>
              <div className="flex h-12 w-12 items-center justify-center rounded-[18px] border border-line bg-[var(--surface-elevated)] text-text">
                <UserRound size={18} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
