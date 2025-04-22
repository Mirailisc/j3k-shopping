export type TransactionType = 'income' | 'outcome'
export type TransactionStatus = 'completed' | 'pending' | 'cancelled'

export interface Transaction {
  id: string
  date: Date
  description: string
  amount: number
  type: TransactionType
}
