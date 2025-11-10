'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { updateOrderStatus } from '@/api/services/orders'
import { updateOrderStats } from '@/hooks/useOrderUpdates'

import {
  OrderType,
  OrderStatusEnum,
  OrdersResponse,
  OrderFilterType,
  OrderStats
} from '@/types/models/order'

export const useUpdateOrderStatus = (
  queryKey: (string | number | OrderFilterType | null)[],
  onSuccess?: () => void
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      orderId,
      newStatus
    }: {
      orderId: number
      newStatus: OrderStatusEnum
    }) => updateOrderStatus(orderId, newStatus),
    onMutate: async ({
      orderId,
      newStatus
    }: {
      orderId: number
      newStatus: OrderStatusEnum
    }) => {
      await queryClient.cancelQueries({ queryKey })
      await queryClient.cancelQueries({ queryKey: ['order', orderId] })
      await queryClient.cancelQueries({ queryKey: ['stats'] })

      const previousOrders = queryClient.getQueryData<OrdersResponse>(queryKey)
      const previousOrder = queryClient.getQueryData<OrderType>([
        'order',
        orderId
      ])
      const previousStats = queryClient.getQueryData<OrderStats>(['stats'])

      const previousStatus =
        previousOrder?.status ??
        previousOrders?.orders.find(o => o.id === orderId)?.status ??
        null

      if (previousOrders)
        queryClient.setQueryData<OrdersResponse>(queryKey, oldData => {
          if (!oldData) return oldData

          return {
            ...oldData,
            orders: oldData.orders.map(order =>
              order.id === orderId ? { ...order, status: newStatus } : order
            )
          }
        })

      if (previousOrder)
        queryClient.setQueryData<OrderType>(['order', orderId], oldData => {
          if (!oldData) return oldData
          return { ...oldData, status: newStatus }
        })

      const deliveryDate =
        newStatus === OrderStatusEnum.Delivered
          ? new Date().toISOString()
          : undefined

      updateOrderStats(
        queryClient,
        previousStatus,
        newStatus,
        deliveryDate
      )

      return { previousOrders, previousOrder, previousStats }
    },
    onError: (
      _: Error,
      __: { orderId: number; newStatus: OrderStatusEnum },
      context?: {
        previousOrders?: OrdersResponse
        previousOrder?: OrderType
        previousStats?: OrderStats
      }
    ) => {
      if (context?.previousOrders)
        queryClient.setQueryData(queryKey, context.previousOrders)

      if (context?.previousOrder)
        queryClient.setQueryData(
          ['order', context.previousOrder.id],
          context.previousOrder
        )

      if (context?.previousStats)
        queryClient.setQueryData(['stats'], context.previousStats)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-orders'] })
      queryClient.invalidateQueries({ queryKey: ['all'] })
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      onSuccess?.()
    }
  })
}
