import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateTransactionDto } from './dto/create-transaction.dto'

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
    userId: string,
  ) {}
}
