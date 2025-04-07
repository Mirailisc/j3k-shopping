import { ApiProperty } from '@nestjs/swagger'

export class CreateProductDto {
  @ApiProperty({
    description: 'The name of the product',
    example: 'Product 1',
  })
  name: string

  @ApiProperty({
    description: 'The image of the product as data URL',
    example: 'data:image/png;base64,base64encodedImage',
  })
  productImg: string

  @ApiProperty({
    description: 'The description of the product',
    example: 'This is product 1',
  })
  description: string

  @ApiProperty({
    description: 'The price of the product',
    example: 100,
  })
  price: number

  @ApiProperty({
    description: 'The quantity of the product',
    example: 10,
  })
  quantity: number

  @ApiProperty({
    description: 'The id of the user who created the product',
    example: '1',
  })
  userId: string
}
