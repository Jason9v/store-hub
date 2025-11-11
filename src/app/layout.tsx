import './globals.css'

import { ReactNode } from 'react'
import { Metadata } from 'next'
import { getMessages, getLocale } from 'next-intl/server'

import { Navbar, ProtectedContent } from '@/components'
import Providers from './providers'

export const metadata: Metadata = {
  title: 'Storefront',
  description: `Online store offering a wide range of products to 
                support your journey. From high-quality items to essential tools, 
                our carefully curated collection helps you achieve your goals. 
                Explore our products and enhance your experience.`
}

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html>
      <body
        className="bg-background dark:bg-background-dark min-w-full w-fit [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2
                   [&::-webkit-scrollbar-track]:bg-secondary [&::-webkit-scrollbar-thumb]:bg-foreground
                   dark:[&::-webkit-scrollbar-track]:bg-secondary-dark dark:[&::-webkit-scrollbar-thumb]:bg-foreground-dark
                     [&::-webkit-scrollbar-thumb]:rounded-full"
      >
        <Providers messages={messages} locale={locale}>
          <Navbar />
          <ProtectedContent>{children}</ProtectedContent>
        </Providers>
      </body>
    </html>
  )
}

export default RootLayout
