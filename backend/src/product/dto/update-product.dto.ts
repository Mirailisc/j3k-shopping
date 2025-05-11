import { ApiProperty } from '@nestjs/swagger'

export class UpdateProductDto {
  @ApiProperty({
    description: 'The name of the product',
    example: 'Product 1',
  })
  name: string

  @ApiProperty({
    description: 'The image of the product as data URL',
    example: 'data:image/png;base64,base64encodedImage',
  })
  productImg: Buffer<ArrayBufferLike>

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
}
