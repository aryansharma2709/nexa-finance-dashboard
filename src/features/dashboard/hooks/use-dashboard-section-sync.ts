import { useEffect } from 'react'
import type { DashboardSectionId } from '@/store/ui-store'
import { dashboardSectionIds, useUiStore } from '@/store/ui-store'

const observerSections = [...dashboardSectionIds]

export function useDashboardSectionSync() {
  const setActiveSection = useUiStore((state) => state.setActiveSection)

  useEffect(() => {
    const elements = observerSections
      .map((sectionId) => document.getElementById(sectionId))
      .filter((element): element is HTMLElement => Boolean(element))

    if (elements.length === 0) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)

        const nextSection = visibleEntries[0]?.target.id as DashboardSectionId | undefined

        if (nextSection) {
          setActiveSection(nextSection)
        }
      },
      {
        rootMargin: '-20% 0px -55% 0px',
        threshold: [0.2, 0.35, 0.5, 0.7],
      },
    )

    elements.forEach((element) => observer.observe(element))

    return () => {
      observer.disconnect()
    }
  }, [setActiveSection])
}
