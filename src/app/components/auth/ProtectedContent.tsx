'use client'

import { ReactNode, useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'

import { RootState } from '@/store'

import { LoginForm, LoadingSpinner, BackButton } from '@/components'

import { getAccessToken } from '@/utils'

type ProtectedContentProps = {
  children: ReactNode
}

const ProtectedContent = ({ children }: ProtectedContentProps) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  )
  const [isAuthStateSynced, setIsAuthStateSynced] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const authPages = ['/register', '/reset-password']
  const isAuthPage = authPages.includes(pathname)

  useEffect(() => {
    const token = getAccessToken()
    const tokenExists = !!token

    if (isAuthenticated === tokenExists) setIsAuthStateSynced(true)
  }, [isAuthenticated])

  useEffect(() => {
    if (isAuthenticated && isAuthPage) router.replace('/')
  }, [isAuthenticated, isAuthPage, router])

  if (!isAuthStateSynced) return <LoadingSpinner />

  if (!isAuthenticated) return isAuthPage ? <>{children}</> : <LoginForm />

  if (isAuthenticated && isAuthPage) return null

  return (
    <>
      {pathname !== '/' && <BackButton />}
      {children}
    </>
  )
}

export default ProtectedContent
