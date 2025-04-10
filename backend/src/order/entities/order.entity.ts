import { ApiProperty } from '@nestjs/swagger'
import { OrderStatus } from '@prisma/client'

export class Order {
  @ApiProperty({
    description: 'The id of the order',
    example: 'random-uuid',
    format: 'uuid',
  })
  id: string

  @ApiProperty({
    description: 'The status of the order',
    example: 'Pending',
    enum: OrderStatus,
  })
  status: OrderStatus

  @ApiProperty({
    description: 'The total price of the order',
    example: 100,
  })
  total: number

  @ApiProperty({
    description: 'The id of the user who created the order',
    example: 'random-uuid',
    format: 'uuid',
  })
  userId: string

  @ApiProperty({
    description: 'The evidence of the order',
    example: 'data:image/png;base64,base64encodedImage',
    nullable: true,
  })
  evidence: string

  @ApiProperty({
    description: 'The id of the product',
    example: 'random-uuid',
    format: 'uuid',
  })
  productId: string

  @ApiProperty({
    description: 'The amount of the order',
    example: 1,
  })
  amount: number

  @ApiProperty({
    description: 'The created date of the order',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date

  @ApiProperty({
    description: 'The updated date of the order',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date
}
