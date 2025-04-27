import { OrderStatus, toOrderStatus } from '@/types/order'
import NotFound from '../NotFound'
import OrderStatusIndicator from '@/components/Order/OrderStatusIndicator'
import OrderDetails, { OrderDetails as OrderType } from '@/components/Order/OrderDetails'
import PaymentEvidence from '@/components/Order/PaymentEvidence'
import { useParams } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import { axiosInstance } from '@/lib/axios'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'

export default function OrderInfo() {
  const [order, setOrder] = useState<OrderType | null>(null)
  const params = useParams()

  const getOrder = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/order/buyer/${params.orderId}`)
      setOrder({
        ...response.data,
        status: toOrderStatus(response.data.status),
      })
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Something went wrong'
        toast.error(errorMessage)
      } else {
        toast.error('An unexpected error occurred')
      }
    }
  }, [params.orderId])

  useEffect(() => {
    getOrder()
  }, [getOrder])

  if (!params.orderId) return <NotFound />

  if (!order) return <NotFound />

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Order #{order.id}</h1>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <OrderStatusIndicator status={order.status} order={order} />
          <OrderDetails order={order} />
        </div>

        <div>
          {order.status === OrderStatus.Pending && (
            <PaymentEvidence orderId={order.id} existingEvidence={order.evidence} />
          )}
        </div>
      </div>
    </div>
  )
}
