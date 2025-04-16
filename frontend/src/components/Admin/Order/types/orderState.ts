export enum OrderStatus {
  Pending,
  Paid,
  Shipped,
  Delivering,
  Completed,
  Cancelled,
  Refunded,
  Refunding,
}

export const stateOption = [
  { label: "Pending", value: OrderStatus.Pending },
  { label: "Paid", value: OrderStatus.Paid },
  { label: "Shipped", value: OrderStatus.Shipped },
  { label: "Delivering", value: OrderStatus.Delivering },
  { label: "Completed", value: OrderStatus.Completed },
  { label: "Cancelled", value: OrderStatus.Cancelled },
  { label: "Refunding", value: OrderStatus.Refunding },
  { label: "Refunded", value: OrderStatus.Refunded },
] as const;
