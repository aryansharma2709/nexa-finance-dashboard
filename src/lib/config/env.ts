export const env = {
  enableMsw: import.meta.env.VITE_ENABLE_MSW !== 'false',
} as const
