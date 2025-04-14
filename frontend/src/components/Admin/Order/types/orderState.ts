export const stateOption = [
    {label: "Pending"},
    {label: "Paid"},
    {label: "Shipped"},
    {label: "Delivering"},
    {label: "Completed"},
    {label: "Cancelled"},
    {label: "Refunding"},
    {label: "Refunded"},
] as const

export enum OrderStatus {
  Pending = 'Pending',
  Paid = 'Paid',
  Shipped = 'Shipped',
  Delivering = 'Delivering',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
  Refunding = 'Refunding',
  Refunded = 'Refunded',
}