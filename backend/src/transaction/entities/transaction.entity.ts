export type TransactionType = 'income' | 'outcome'

export class Transaction {
  id: string
  date: Date
  description: string
  amount: number
  type: TransactionType
}
