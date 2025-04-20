import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { OrderWithUsername } from "@/types/order"
import OrderCard from "./order-card"

interface SortableOrderCardProps {
  order: OrderWithUsername
  onClick: () => void
}

export default function SortableOrderCard({ order, onClick }: SortableOrderCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: order.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <OrderCard order={order} onClick={onClick} />
    </div>
  )
}
