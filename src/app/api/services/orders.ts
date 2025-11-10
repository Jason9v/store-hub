import {
  OrderType,
  OrderRequest,
  OrderStatusEnum,
  OrderFilterType,
  OrdersResponse,
  OrderStats,
  PaginationParams
} from '@/types'
import {
  mockOrderService,
  mockUserService,
  mockNotificationService
} from '@/utils'
import {
  decodeUserFromToken,
  getAccessToken,
  checkOrderAgainstFilters
} from '@/utils'
import { fetchItems } from './items'

const getAuthenticatedUser = () => {
  const token = getAccessToken()
  if (!token) throw new Error('unauthorized')

  const user = decodeUserFromToken(token)
  if (!user) throw new Error('unauthorized')

  return user
}

const paginateOrders = (
  orders: OrderType[],
  params: PaginationParams
): OrdersResponse => {
  const startIndex = (params.pageNumber - 1) * params.pageSize
  const endIndex = startIndex + params.pageSize
  const paginatedOrders = orders.slice(startIndex, endIndex)

  return {
    orders: paginatedOrders,
    totalItems: orders.length,
    totalPages: Math.ceil(orders.length / params.pageSize)
  }
}

const filterOrders = (
  orders: OrderType[],
  filter: OrderFilterType
): OrderType[] => {
  if (!filter || Object.keys(filter).length === 0) return orders
  return orders.filter(order => checkOrderAgainstFilters(order, filter))
}

export const createOrder = async (
  request: OrderRequest
): Promise<OrderType> => {
  const user = getAuthenticatedUser()

  const items = await fetchItems({ pageNumber: 1, pageSize: 100 })
  const itemMap = new Map(items.items.map(item => [item.id, item]))

  const orderItems = request.items.map(({ itemId, quantity }) => {
    const item = itemMap.get(itemId)
    if (!item) throw new Error(`itemNotFound: ${itemId}`)

    return { ...item, quantity }
  })

  const totalPrice = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const order = mockOrderService.createOrder({
    username: user.email || '',
    totalPrice,
    items: orderItems
  })

  return order
}

export const fetchOrderById = async (id: number): Promise<OrderType> => {
  const order = mockOrderService.getOrderById(id)
  if (!order) throw new Error('orderNotFound')

  return order
}

export const fetchMyOrders = async (
  params: PaginationParams,
  filter: OrderFilterType = {}
): Promise<OrdersResponse> => {
  const user = getAuthenticatedUser()

  let dbUser = mockUserService.getUserById(user.id || 0)

  if (!dbUser && user.email) dbUser = mockUserService.getUserByEmail(user.email)

  const userEmail = dbUser?.email || user.email

  if (!userEmail)
    return {
      orders: [],
      totalItems: 0,
      totalPages: 0
    }

  const allOrders = mockOrderService
    .getOrders()
    .filter(order => order.username === userEmail)

  const sortedOrders = [...allOrders].sort((a, b) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()

    return dateB - dateA
  })

  const filteredOrders = filterOrders(sortedOrders, filter)

  return paginateOrders(filteredOrders, params)
}

export const fetchAllOrders = async (
  params: PaginationParams,
  filter: OrderFilterType = {}
): Promise<OrdersResponse> => {
  const allOrders = mockOrderService.getOrders()
  const filteredOrders = filterOrders(allOrders, filter)

  return paginateOrders(filteredOrders, params)
}

export const fetchOrderStats = async (): Promise<OrderStats> => {
  const orders = mockOrderService.getOrders()

  const stats: OrderStats = {
    deliveredToday: 0,
    pendingOrders: 0,
    shippingOrders: 0
  }

  orders.forEach(order => {
    if (order.status === OrderStatusEnum.Delivered) stats.deliveredToday++

    if (order.status === OrderStatusEnum.Pending) stats.pendingOrders++

    if (order.status === OrderStatusEnum.Shipping) stats.shippingOrders++
  })

  return stats
}

export const updateOrderStatus = async (
  orderId: number,
  newStatus: OrderStatusEnum
): Promise<void> => {
  mockOrderService.updateOrderStatus(orderId, newStatus)

  const order = mockOrderService.getOrderById(orderId)
  if (!order) return

  const targetUser = mockUserService.getUserByEmail(order.username)
  if (!targetUser) return

  mockNotificationService.createNotification({
    messageKey: 'orderStatusUpdate',
    isRead: false,
    additionalData: JSON.stringify({
      orderId: order.id,
      status: OrderStatusEnum[newStatus]
    })
  })
}
