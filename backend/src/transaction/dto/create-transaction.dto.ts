import { TransactionType } from '../entities/transaction.entity'

export class CreateTransactionDto {
  description: string
  amount: number
  type: TransactionType
}
