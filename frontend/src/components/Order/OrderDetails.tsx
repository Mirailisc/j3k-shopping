import type { OrderWithUsername } from '@/types/order'
import { formatDate } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface OrderDetailsProps {
  order: OrderWithUsername
}

export default function OrderDetails({ order }: OrderDetailsProps) {
  return (
    <Card className="border border-black/20 dark:border-white/10">
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
            <p className="font-semibold">${order.total.toFixed(2)}</p>
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
          <p>{order.contact?.address || 'No address provided'}</p>
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Order Items</h3>
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex justify-between">
              <div>
                <p className="font-medium">Product #{order.productId}</p>
                <p className="text-sm text-muted-foreground">Quantity: {order.amount}</p>
              </div>
              <p className="font-semibold">${order.total.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
