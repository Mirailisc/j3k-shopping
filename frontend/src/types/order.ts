enum OrderStatus {
  Pending,
  Paid,
  Shipped,
  Delivering,
  Completed,
  Cancelled,
  Refunded,
  Refunding,
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
