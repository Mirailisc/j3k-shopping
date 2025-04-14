import { ApiProperty } from '@nestjs/swagger'

export class CreateReviewDto {
  @ApiProperty({
    description: 'Rating of the product',
    example: 5,
  })
  rating: Number

  @ApiProperty({
    description: 'The comment of the product',
    example: 'The product is cute.',
  })
  comment: String

  @ApiProperty({
    description: 'The ID of the product whose rated',
    example: 'pid'
  })
  productId: string

  @ApiProperty({
    description: 'The ID of the user who rated product',
    example: 'uuid',
  })
  userId: string
}
