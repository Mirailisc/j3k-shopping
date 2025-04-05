import { ApiProperty } from '@nestjs/swagger'

export class UpdateSocialDto {
  @ApiProperty({
    example: 'mark55zaza',
    nullable: true,
  })
  line?: string

  @ApiProperty({
    example: 'https://facebook.com/AtsuiMatsuri',
    nullable: true,
  })
  facebook?: string

  @ApiProperty({
    example: 'https://mirailisc.xyz',
    nullable: true,
  })
  website?: string

  @ApiProperty({
    example: '@mirailisc.ts',
    nullable: true,
  })
  instagram?: string

  tiktok?: string
}
