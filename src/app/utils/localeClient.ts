'use client'

export const setLocaleInCookie = async (locale: string) => {
  try {
    const oneYear = 60 * 60 * 24 * 365
    document.cookie = `NEXT_LOCALE=${locale}; path=/; samesite=lax; max-age=${oneYear}`

    window.location.reload()
  } catch {
    // No-op in environments where document is unavailable.
  }
}
