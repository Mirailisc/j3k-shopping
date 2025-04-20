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
}

export function toOrderStatus(status: string): OrderStatus {
  return OrderStatus[status as keyof typeof OrderStatus]
}