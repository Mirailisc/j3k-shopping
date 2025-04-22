import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import OrderCard from './order-card'
import { OrderWithUsername } from '@/types/order'

interface DraggableOrderCardProps {
  order: OrderWithUsername
  onClick: () => void
}

export default function DraggableOrderCard({ order, onClick }: DraggableOrderCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: order.id,
  })

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
      }
    : undefined

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="touch-none">
      <OrderCard order={order} onClick={onClick} />
    </div>
  )
}
