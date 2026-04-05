import { HttpResponse, http } from 'msw'
import { insightHandlers } from '@/lib/msw/handlers/insights'
import { transactionHandlers } from '@/lib/msw/handlers/transactions'
import { apiRoute } from '@/lib/msw/routes'

export const handlers = [
  http.get(apiRoute('health'), () =>
    HttpResponse.json({
      status: 'ok',
    }),
  ),
  ...transactionHandlers,
  ...insightHandlers,
]
