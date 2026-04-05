import type { PropsWithChildren } from 'react'
import { Toaster } from 'sonner'
import { useDashboardStore } from '@/store/dashboard-store'

export function AppProviders({ children }: PropsWithChildren) {
  const theme = useDashboardStore((state) => state.theme)

  return (
    <>
      {children}
      <Toaster
        position="top-right"
        richColors
        closeButton
        theme={theme}
        toastOptions={{
          classNames: {
            toast:
              theme === 'dark'
                ? 'border border-white/10 bg-neutral-950 text-neutral-50'
                : 'border border-slate-200 bg-white text-slate-900 shadow-lg',
            description: theme === 'dark' ? 'text-neutral-400' : 'text-slate-500',
          },
        }}
      />
    </>
  )
}
