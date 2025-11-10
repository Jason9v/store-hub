'use client'

import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'

import { withBasePath } from '@/utils'

type AuthenticatedLinksProps = {
  isAdmin: boolean
  onLinkClick: () => void
}

const AuthenticatedLinks = ({
  isAdmin,
  onLinkClick
}: AuthenticatedLinksProps) => {
  const translations = useTranslations('Navbar')

  return (
    <>
      <Link
        href="/my-orders"
        className="flex items-center space-x-2"
        onClick={onLinkClick}
      >
        <Image
          src={withBasePath('/icons/navbar/cart.svg')}
          width={20}
          height={20}
          alt="My orders"
          className="dark:invert"
          priority
        />

        <p className="hidden lg:block">{translations('myOrders')}</p>
      </Link>

      {isAdmin && (
        <>
          <Link
            href="/admin/users"
            className="flex items-center space-x-2"
            onClick={onLinkClick}
          >
            <Image
              src={withBasePath('/icons/navbar/group-of-people.svg')}
              width={20}
              height={20}
              alt="Users management"
              className="dark:invert"
              priority
            />

            <p className="hidden lg:block">{translations('usersManagement')}</p>
          </Link>

          <Link
            href="/admin/orders"
            className="flex items-center space-x-2"
            onClick={onLinkClick}
          >
            <Image
              src={withBasePath('/icons/navbar/management.svg')}
              width={20}
              height={20}
              alt="Orders management"
              className="dark:invert"
              priority
            />

            <p className="hidden lg:block">
              {translations('ordersManagement')}
            </p>
          </Link>
        </>
      )}
    </>
  )
}

export default AuthenticatedLinks
