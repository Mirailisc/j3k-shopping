import { Contact } from "./user"

export enum OrderStatus {
  Pending,
  Paid,
  Delivering,
  Shipped,
  Completed,
  Refunding,
  Refunded,
  Cancelled,
}

export type Order = {
    id: string
    status:OrderStatus 
    createdAt: string
    total: number
    userId: string
    evidence: string
    productId: string
    amount: number
}

export interface OrderWithUsername extends Omit<Order, 'userId'> {
  username: string
  contact: Partial<Contact>
  email: string
}

export function toOrderStatus(status: string): OrderStatus {
  return OrderStatus[status as keyof typeof OrderStatus]
}

export function getOrderStatusEnum(status: string | OrderStatus): OrderStatus {
  if (typeof status === "number") {
    return status
  }

  const statusMap: Record<string, OrderStatus> = {
    Pending: OrderStatus.Pending,
    Paid: OrderStatus.Paid,
    Shipped: OrderStatus.Shipped,
    Delivering: OrderStatus.Delivering,
    Completed: OrderStatus.Completed,
    Cancelled: OrderStatus.Cancelled,
    Refunded: OrderStatus.Refunded,
    Refunding: OrderStatus.Refunding,
  }

  return statusMap[status] ?? OrderStatus.Pending
}