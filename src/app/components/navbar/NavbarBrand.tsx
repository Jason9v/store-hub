'use client'

import Image from 'next/image'
import Link from 'next/link'

import { withBasePath } from '@/utils'

const NavbarBrand = () => (
  <Link href="/">
    <div className="flex items-center text-foreground dark:text-foreground-dark">
      <Image
        src={withBasePath('/icons/navbar/fitness.svg')}
        width={40}
        height={40}
        alt="Fitness"
        className="dark:invert"
        priority
      />

      <span
        className="ml-3 font-bold uppercase text-2xl text-shadow text-shadow-blur-10
                     text-shadow-foreground dark:text-shadow-foreground-dark tracking-wider"
      >
        Store Hub
      </span>
    </div>
  </Link>
)

export default NavbarBrand
