'use client'

import Image from 'next/image'

import { withBasePath } from '@/utils'

type MobileMenuButtonProps = {
  onClick: () => void
  menuIconRef: React.RefObject<HTMLButtonElement | null>
}

const MobileMenuButton = ({ onClick, menuIconRef }: MobileMenuButtonProps) => (
  <button
    ref={menuIconRef}
    className="lg:hidden text-foreground dark:text-foreground-dark"
    onClick={onClick}
  >
    <Image
      src={withBasePath('/icons/navbar/menu.svg')}
      width={22}
      height={22}
      alt="Menu"
      className="dark:invert"
      priority
    />
  </button>
)

export default MobileMenuButton
