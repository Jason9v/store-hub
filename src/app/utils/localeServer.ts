import { cookies } from 'next/headers'

const COOKIE_NAME = 'NEXT_LOCALE'
const DEFAULT_LOCALE = 'en'

export const getLocaleFromCookie = async () => {
  if (process.env.GITHUB_PAGES === 'true') return DEFAULT_LOCALE

  try {
    const cookiesInstance = await cookies()
    return cookiesInstance.get(COOKIE_NAME)?.value ?? DEFAULT_LOCALE
  } catch {
    return DEFAULT_LOCALE
  }
}
