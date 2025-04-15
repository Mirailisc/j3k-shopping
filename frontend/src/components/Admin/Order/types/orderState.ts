export enum OrderStatus {
<<<<<<< HEAD
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
=======
  Pending = 'Pending',
  Paid = 'Paid',
  Shipped = 'Shipped',
  Delivering = 'Delivering',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
  Refunding = 'Refunding',
  Refunded = 'Refunded',
}
>>>>>>> 1ecb80c59903c7295596b80f2d5b90afc9b70950
