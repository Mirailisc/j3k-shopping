import { ApiProperty } from '@nestjs/swagger'

export class UpdateReviewDto {
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
}