import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from '@/app/App'
import { env } from '@/lib/config/env'
import '@/styles/index.css'

async function enableMocking() {
  if (!env.enableMsw || !import.meta.env.DEV) {
    return
  }

  const { startMockWorker } = await import('@/lib/msw/browser')
  await startMockWorker()
}

async function bootstrap() {
  await enableMocking()

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

void bootstrap()
