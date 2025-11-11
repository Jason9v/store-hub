'use client'

import { ReactNode, useEffect, useState } from 'react'
import { AbstractIntlMessages, NextIntlClientProvider } from 'next-intl'
import { ThemeProvider } from 'next-themes'
import { Provider, useDispatch } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import store, { AppDispatch, setAuthState } from '@/store'
import { getAccessToken } from '@/utils'
import { LoadingSpinner } from '@/components/ui'

const queryClient = new QueryClient()

const AuthSync = () => {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    const token = getAccessToken()
    dispatch(setAuthState(!!token))
  }, [dispatch])

  return null
}

const Providers = ({
  children,
  messages,
  locale
}: {
  children: ReactNode
  messages: AbstractIntlMessages
  locale: string
}) => {
  const [mounted, setMounted] = useState(false)
  const [clientLocale, setClientLocale] = useState(locale)
  const [clientMessages, setClientMessages] =
    useState<AbstractIntlMessages>(messages)
  const [messagesLoaded, setMessagesLoaded] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const hasStaticBasePath = !!process.env.NEXT_PUBLIC_BASE_PATH

    if (!hasStaticBasePath) {
      setMessagesLoaded(true)
      return
    }

    const loadMessages = async () => {
      const cookie = document.cookie
        .split('; ')
        .find(cookie => cookie.startsWith('NEXT_LOCALE='))

      const nextLocale = cookie?.split('=')[1] || 'en'

      try {
        const messagesModule = await import(`../../messages/${nextLocale}.json`)
        setClientLocale(nextLocale)
        setClientMessages(messagesModule.default as AbstractIntlMessages)
      } catch {
        // Fallback remains the server-provided defaults
      } finally {
        setMessagesLoaded(true)
      }
    }

    loadMessages()
  }, [])

  // Show loading spinner during mount or message loading instead of null
  if (!mounted || !messagesLoaded) return <LoadingSpinner />

  return (
    <NextIntlClientProvider messages={clientMessages} locale={clientLocale}>
      <ThemeProvider attribute="class">
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
            <AuthSync />
            {children}
          </Provider>
        </QueryClientProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  )
}

export default Providers
