import { formatCurrency, formatDate } from "@/lib/utils"
import { type OrderWithUsername, OrderStatus } from "@/types/order"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface OrderCardProps {
  order: OrderWithUsername
  onClick?: () => void
}

export default function OrderCard({ order, onClick }: OrderCardProps) {
  const statusColors: Record<OrderStatus, string> = {
    [OrderStatus.Pending]: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    [OrderStatus.Paid]: "bg-green-500/10 text-green-500 border-green-500/20",
    [OrderStatus.Shipped]: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    [OrderStatus.Delivering]: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    [OrderStatus.Completed]: "bg-green-700/10 text-green-700 border-green-700/20",
    [OrderStatus.Cancelled]: "bg-red-500/10 text-red-500 border-red-500/20",
    [OrderStatus.Refunded]: "bg-gray-500/10 text-gray-500 border-gray-500/20",
    [OrderStatus.Refunding]: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  }

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardContent className="p-3">
        <div className="flex justify-between items-start mb-2">
          <span className="font-medium text-sm">#{order.id.slice(0, 8)}</span>
          <Badge variant="outline" className={statusColors[order.status]}>
            {OrderStatus[order.status]}
          </Badge>
        </div>

        <div className="text-xs text-muted-foreground mb-2">{formatDate(order.createdAt)}</div>

        <div className="flex justify-between items-center">
          <div className="text-xs">
            <span className="font-medium">Qty:</span> {order.amount}
          </div>
          <div className="font-semibold">{formatCurrency(order.total)}</div>
        </div>
      </CardContent>
    </Card>
  )
}
