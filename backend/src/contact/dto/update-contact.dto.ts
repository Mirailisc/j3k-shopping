import { ApiProperty } from '@nestjs/swagger'

export class UpdateContactDto {
  @ApiProperty({
    example: '12345678910111213',
    nullable: true,
  })
  citizenId?: string

  @ApiProperty({
    example: '0987654321',
    nullable: true,
  })
  phone?: string

  @ApiProperty({
    example: '199/99 De Snutz',
    nullable: true,
  })
  address?: string

  @ApiProperty({
    example: 'Bangpusi',
    nullable: true,
  })
  city?: string

  @ApiProperty({
    example: 'Bangdik',
    nullable: true,
  })
  province?: string

  @ApiProperty({
    example: '69420',
    nullable: true,
  })
  zipCode?: string

  @ApiProperty({
    example: 'Thailand',
    nullable: true,
  })
  country?: string
}
