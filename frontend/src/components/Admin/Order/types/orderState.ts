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
  Pending,
  Paid,
  Shipped,
  Delivering,
  Completed,
  Cancelled,
  Refunded,
  Refunding,
}