import { formatCurrency, formatDate } from '@/lib/utils'
import { OrderStatus, OrderWithUsername } from '@/types/order'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Clock, Package, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { USER_INFO_PATH } from '@/constants/routes'

interface OrderDetailsDialogProps {
  order: OrderWithUsername | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function OrderDetailsDialog({ order, open, onOpenChange }: OrderDetailsDialogProps) {
  if (!order) return null

  const statusColors: Record<OrderStatus, string> = {
    [OrderStatus.Pending]: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    [OrderStatus.Paid]: 'bg-green-500/10 text-green-500 border-green-500/20',
    [OrderStatus.Shipped]: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    [OrderStatus.Delivering]: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    [OrderStatus.Completed]: 'bg-green-700/10 text-green-700 border-green-700/20',
    [OrderStatus.Cancelled]: 'bg-red-500/10 text-red-500 border-red-500/20',
    [OrderStatus.Refunded]: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
    [OrderStatus.Refunding]: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Order #{order.id.slice(0, 8)}</span>
            <Badge variant="outline" className={statusColors[order.status]}>
              {OrderStatus[order.status]}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div className="text-sm">
              <span className="font-medium">Created: </span>
              {formatDate(order.createdAt)}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <User className="h-4 w-4 text-muted-foreground" />
            <div className="text-sm">
              <span className="font-medium">Customer: </span>
              <Link
                to={USER_INFO_PATH.replace(':username', order.username)}
                className="text-sm transition-colors hover:text-emerald-500"
              >
                {order.username}
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Package className="h-4 w-4 text-muted-foreground" />
            <div className="text-sm">
              <span className="font-medium">Product ID: </span>
              {order.productId}
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium mb-1">Quantity</div>
              <div>{order.amount}</div>
            </div>
            <div>
              <div className="text-sm font-medium mb-1">Total</div>
              <div className="text-lg font-bold">{formatCurrency(order.total)}</div>
            </div>
          </div>

          {order.evidence && (
            <>
              <Separator />
              <div>
                <div className="text-sm font-medium mb-2">Evidence</div>
                <img src={order.evidence} alt="evidence" className="w-full rounded-md" />
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
