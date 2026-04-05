import { HttpResponse, http } from 'msw'
import {
  selectCategoryTotals,
  selectDashboardTotals,
  selectInsightsData,
  selectMonthlyTrendData,
} from '@/store/dashboard-selectors'
import { getDashboardStoreState } from '@/lib/msw/mock-db'
import { apiRoute } from '@/lib/msw/routes'
import { failIfRequested, maybeDelay } from '@/lib/msw/utils'

export const insightHandlers = [
  http.get(apiRoute('insights'), async ({ request }) => {
    const failure = await failIfRequested(request, 'Failed to load insights.')

    if (failure) {
      return failure
    }

    await maybeDelay()

    const state = getDashboardStoreState()

    return HttpResponse.json({
      data: {
        totals: selectDashboardTotals(state),
        monthlyTrend: selectMonthlyTrendData(state),
        categoryTotals: selectCategoryTotals(state),
        insights: selectInsightsData(state),
      },
    })
  }),
] as const
