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
    nullable: true,
  })
  firstName: string

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe',
    nullable: true,
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

  @ApiProperty({
    nullable: true,
  })
  line: string

  @ApiProperty({
    nullable: true,
  })
  facebook: string

  @ApiProperty({
    nullable: true,
  })
  instagram: string

  @ApiProperty({
    nullable: true,
  })
  tiktok: string

  @ApiProperty({
    nullable: true,
  })
  website: string

  @ApiProperty({
    nullable: true,
  })
  phone: string

  @ApiProperty({
    nullable: true,
  })
  address: string

  @ApiProperty({
    nullable: true,
  })
  city: string

  @ApiProperty({
    nullable: true,
  })
  province: string

  @ApiProperty({
    nullable: true,
  })
  zipCode: string

  @ApiProperty({
    nullable: true,
  })
  country: string
}
