import type { OrderStatus, OrderWithUsername } from '@/types/order'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatDate } from '@/lib/utils'
import { Link } from 'react-router-dom'
import { PRODUCT_INFO_PATH } from '@/constants/routes'

export interface OrderDetails extends Omit<OrderWithUsername, 'status'> {
  status: OrderStatus
}

interface OrderDetailsProps {
  order: OrderDetails
}

export default function OrderDetails({ order }: OrderDetailsProps) {
  const formattedPrice = new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
  }).format(order.total)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Order Date</h3>
            <p>{formatDate(order.createdAt)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Order Total</h3>
            <p className="font-semibold">{formattedPrice}</p>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Customer Information</h3>
          <div className="space-y-1">
            <p>{order.username}</p>
            <p>{order.email}</p>
            {order.contact?.phone && <p>{order.contact.phone}</p>}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Shipping Address</h3>
          <div className="text-sm">
            <p>{order.contact.address}</p>
            <p>
              {order.contact.city}, {order.contact.province} {order.contact.zipCode}
            </p>
            <p>{order.contact.country}</p>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Order Items</h3>
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex justify-between">
              <Link to={PRODUCT_INFO_PATH.replace(':productId', order.productId)}>
                <p className="font-medium">Product #{order.productId.slice(0, 8)}</p>
                <p className="text-sm text-muted-foreground">Quantity: {order.amount}</p>
              </Link>
              <p className="font-semibold">{formattedPrice}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
