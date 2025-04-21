import { OrderStatus } from '@/types/order'
import NotFound from '../NotFound'
import OrderStatusIndicator from '@/components/Order/OrderStatusIndicator'
import OrderDetails from '@/components/Order/OrderDetails'
import PaymentEvidence from '@/components/Order/PaymentEvidence'
import { useParams } from 'react-router-dom'

function getOrder(id: string) {
  const order = {
    id,
    status: OrderStatus.Pending, // Example status
    createdAt: new Date().toISOString(),
    total: 129.99,
    username: 'John Doe',
    contact: {
      phone: '+1 234 567 8900',
      address: '123 Main St, City, Country',
    },
    email: 'john.doe@example.com',
    evidence: '',
    productId: 'prod_123',
    amount: 1,
  }

  return order
}

export default function OrderInfo() {
  const params = useParams()

  if (!params.orderId) return <NotFound />

  const order = getOrder(params.orderId)

  if (!order) return <NotFound />

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Order #{order.id}</h1>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <OrderStatusIndicator status={order.status} />
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
