export function apiRoute(path: string) {
  return `*/api/${path}`
}

export function isApiRequest(url: string) {
  return new URL(url).pathname.startsWith('/api/')
}
