import type { PropsWithChildren } from 'react'

export function LayoutContent({ children }: PropsWithChildren) {
  return <main className="flex-1 px-4 pb-4 lg:px-6 lg:pb-6">{children}</main>
}
