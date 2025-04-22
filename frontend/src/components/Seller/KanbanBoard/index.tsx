import { useEffect, useState } from 'react'
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { OrderStatus, OrderWithUsername, toOrderStatus } from '@/types/order'
import KanbanColumn from './components/kanban-column'
import OrderCard from './components/order-card'
import OrderDetailsDialog from './components/order-details-dialog'
import { axiosInstance } from '@/lib/axios'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'

export default function KanbanBoard() {
  const [orders, setOrders] = useState<OrderWithUsername[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<OrderWithUsername | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )

  const activeOrder = activeId ? orders.find((order) => order.id === activeId) : null

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveId(active.id as string)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    setActiveId(null)

    if (!over) return

    const orderId = active.id as string
    const statusKey = over.id as keyof typeof OrderStatus
    const newStatus: OrderStatus = OrderStatus[statusKey] as OrderStatus

    const draggedOrder = orders.find((order) => order.id === orderId)

    if (!draggedOrder) return

    if ((draggedOrder.status as number) === parseInt(statusKey)) return

    try {
      await axiosInstance.patch(`/order/status/${orderId}`, { status: newStatus })
      toast.success('Order status updated')
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Failed to update status'
        toast.error(errorMessage)
      } else {
        toast.error('An unexpected error occurred')
      }
    }
    await getOrders()
  }

  const handleOrderClick = (order: OrderWithUsername) => {
    setSelectedOrder(order)
    setIsDetailsOpen(true)
  }

  const columns = Object.values(OrderStatus)
    .filter((value) => typeof value === 'number')
    .map((status) => {
      const statusOrders = orders.filter((order) => order.status === status)
      return {
        status: status as OrderStatus,
        orders: statusOrders,
      }
    })

  const getOrders = async () => {
    try {
      const res = await axiosInstance.get('/order/seller')

      const mappedOrders = res.data.map((order: Omit<OrderWithUsername, 'status'> & { status: string }) => ({
        ...order,
        status: toOrderStatus(order.status),
      }))

      setOrders(mappedOrders)
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Something went wrong'
        toast.error(errorMessage)
      } else {
        toast.error('An unexpected error occurred')
      }
    }
  }

  useEffect(() => {
    getOrders()
  }, [])

  return (
    <>
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns
            .filter((column) => column.status !== OrderStatus.Completed)
            .map((column) => (
              <KanbanColumn
                key={column.status}
                status={column.status}
                orders={column.orders}
                onOrderClick={handleOrderClick}
              />
            ))}
        </div>

        <DragOverlay>{activeOrder ? <OrderCard order={activeOrder} /> : null}</DragOverlay>
      </DndContext>

      <OrderDetailsDialog order={selectedOrder} open={isDetailsOpen} onOpenChange={setIsDetailsOpen} />
    </>
  )
}
