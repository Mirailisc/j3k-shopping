import { ApiProperty } from '@nestjs/swagger'

export class CreateOrderDto {
  @ApiProperty({
    description: 'The id of the user who created the order',
    example: 'random-uuid',
    format: 'uuid',
  })
  userId: string

  @ApiProperty({
    description: 'The id of the product that the order is for',
    example: 'random-uuid',
    format: 'uuid',
  })
  productId: string

  @ApiProperty({
    description: 'The amount of the product that the order is for',
    example: 1,
  })
  amount: number
}
