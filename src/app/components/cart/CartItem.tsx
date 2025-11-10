import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { CartItem as CartItemType } from '@/store'
import { withBasePath } from '@/utils'

type CartItemProps = {
  item: CartItemType
  onRemove: (itemId: number) => void
  onQuantityChange: (itemId: number, delta: number) => void
}

const CartItem = ({ item, onRemove, onQuantityChange }: CartItemProps) => {
  const itemsTranslations = useTranslations('Items')
  const { id, imageUrl, nameKey, price, quantity } = item

  return (
    <li className="flex flex-col lg:flex-row justify-between items-center p-2 rounded-md transition-all duration-300">
      <div className="flex items-center mb-2 lg:mr-10">
        <Image
          src={withBasePath(imageUrl)}
          alt={nameKey}
          width={30}
          height={30}
          className="mr-4"
          priority
        />

        <div>
          <p className="text-foreground dark:text-foreground-dark font-semibold text-sm sm:text-base">
            {itemsTranslations(nameKey)}
          </p>

          <p className="text-foreground-secondary dark:text-foreground-secondary-dark text-xs sm:text-sm">
            € {price}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4 sm:space-x-2">
        <div className="flex items-center space-x-3 mr-1 text-foreground dark:text-foreground-dark">
          <button
            onClick={() => onQuantityChange(id, -1)}
            className="text-md"
            aria-label="Decrease quantity"
          >
            -
          </button>

          <span className="text-sm">{quantity}</span>

          <button
            onClick={() => onQuantityChange(id, 1)}
            className="text-md"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <button
          onClick={() => onRemove(id)}
          className="transition-all duration-300 hover:shadow-md shadow-red-500 border border-red-500
                     rounded-xl p-2 flex items-center justify-center w-8 h-8"
          aria-label="Remove item"
        >
          <Image
            width={20}
            height={20}
            src={withBasePath('/icons/trash.svg')}
            alt="Trash"
            className="transition-all duration-300"
            priority
          />
        </button>
      </div>
    </li>
  )
}

export default CartItem
