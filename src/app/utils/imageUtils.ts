export const getBasePath = (): string => {
  if (typeof window === 'undefined') return ''

  return process.env.NEXT_PUBLIC_BASE_PATH || ''
}

export const withBasePath = (path: string): string => {
  const basePath = getBasePath()

  if (!basePath) return path

  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const normalizedBasePath = basePath.endsWith('/')
    ? basePath.slice(0, -1)
    : basePath

  return `${normalizedBasePath}${normalizedPath}`
}
