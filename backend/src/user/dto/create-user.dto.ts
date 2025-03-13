import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
  @ApiProperty({
    description: 'The username of the user',
    example: 'johndoe123',
  })
  username: string

  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
  })
  email: string

  @ApiProperty({
    description: 'The first name of the user',
    example: 'John',
  })
  firstName: string

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe',
  })
  lastName: string

  @ApiProperty({
    description: 'The admin status of the user',
    example: true,
  })
  isAdmin: boolean

  @ApiProperty({
    description: 'The super admin status of the user',
    example: true,
  })
  isSuperAdmin: boolean

  @ApiProperty({
    description: 'The password for the user account',
    example: 'password123',
    format: 'password',
  })
  password: string
}
