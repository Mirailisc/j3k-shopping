import { ApiProperty } from '@nestjs/swagger'

export class LoginDto {
  @ApiProperty({
    description: 'The username of the user',
    example: 'johndoe123',
  })
  username: string

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  password: string
}
