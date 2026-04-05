import { delay, HttpResponse } from 'msw'
import type { DefaultBodyType, StrictRequest } from 'msw'

export async function maybeDelay(duration = 350) {
  await delay(duration)
}

export function shouldFail(request: StrictRequest<DefaultBodyType>) {
  const url = new URL(request.url)
  const failQuery = url.searchParams.get('fail')
  const failHeader = request.headers.get('x-mock-fail')

  return failQuery === 'true' || failHeader === 'true'
}

export async function failIfRequested(request: StrictRequest<DefaultBodyType>, message: string) {
  if (!shouldFail(request)) {
    return null
  }

  await maybeDelay(250)

  return HttpResponse.json(
    {
      message,
    },
    {
      status: 500,
    },
  )
}
