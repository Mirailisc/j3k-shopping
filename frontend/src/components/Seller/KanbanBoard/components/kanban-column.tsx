import { useDroppable } from "@dnd-kit/core"
import { OrderStatus, OrderWithUsername } from "@/types/order"
import { cn } from "@/lib/utils"
import DraggableOrderCard from "./draggable-order-card"

interface KanbanColumnProps {
  status: OrderStatus
  orders: OrderWithUsername[]
  onOrderClick: (order: OrderWithUsername) => void
}

export default function KanbanColumn({ status, orders, onOrderClick }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  })

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] min-h-[500px]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-sm">{OrderStatus[status]}</h3>
        <span className="bg-primary/10 text-primary text-xs font-medium rounded-full px-2 py-1">{orders.length}</span>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 flex flex-col gap-2 p-3 overflow-y-auto bg-muted/40 rounded-lg",
          isOver && "ring-2 ring-primary",
        )}
      >
        {orders.map((order) => (
          <DraggableOrderCard key={order.id} order={order} onClick={() => onOrderClick(order)} />
        ))}
      </div>
    </div>
  )
}
