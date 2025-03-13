import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import * as bcrypt from 'bcrypt'
import { randomUUID } from 'crypto'
import { User } from '@prisma/client'
import { BCRYPT_SALT_ROUNDS } from 'src/config/bcrypt'

@Injectable()
export class UserService {
  private logger: Logger = new Logger(UserService.name)

  constructor(private prisma: PrismaService) {}

  async getAllUser() {
    return await this.prisma.$queryRaw<User[]>`SELECT * FROM User`
  }

  async getUserById(userId: string) {
    const result = await this.prisma.$queryRaw<
      User[]
    >`SELECT * FROM User WHERE id = ${userId}`

    if (result.length === 0) {
      throw new NotFoundException(`User ${userId} not found`)
    }

    return result[0]
  }

  async getUserByUsername(username: string) {
    const result = await this.prisma.$queryRaw<
      User[]
    >`SELECT * FROM User WHERE username = ${username}`

    if (result.length === 0) {
      throw new NotFoundException(`User ${username} not found`)
    }

    return result[0]
  }

  async deleteUser(id: string) {
    const user = await this.getUserById(id)

    if (id === user.id) {
      throw new BadRequestException('Cannot delete yourself')
    }

    await this.prisma.$executeRaw`DELETE FROM Contact WHERE userId = ${id}`
    await this.prisma.$executeRaw`DELETE FROM Social WHERE userId = ${id}`

    const result = await this.prisma
      .$queryRaw`DELETE FROM User WHERE id = ${id}`

    this.logger.log(`Deleted user ${id}`)
    return result
  }

  async updateUser(id: string, updateUserDto: Omit<CreateUserDto, 'password'>) {
    const { username, email, firstName, lastName, isAdmin, isSuperAdmin } =
      updateUserDto

    const result = await this.prisma.$queryRaw`
      UPDATE User 
      SET username = ${username}, email = ${email}, firstName = ${firstName}, lastName = ${lastName}, isAdmin = ${isAdmin}, isSuperAdmin = ${isSuperAdmin}
      WHERE id = ${id}
    `

    this.logger.log(`Updated user ${id}`)
    return result
  }

  async createUser(createUserDto: CreateUserDto) {
    const {
      username,
      email,
      firstName,
      lastName,
      isAdmin,
      isSuperAdmin,
      password,
    } = createUserDto

    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS)
    const uuid = randomUUID()
    const contactUUID = randomUUID()
    const socialUUID = randomUUID()

    const result = await this.prisma.$queryRaw`
      INSERT INTO User(id, username, email, firstName, lastName, isAdmin, isSuperAdmin, password) 
      VALUES (${uuid}, ${username}, ${email}, ${firstName}, ${lastName}, ${isAdmin}, ${isSuperAdmin}, ${hashedPassword})
    `
    await this.prisma
      .$executeRaw`INSERT INTO Social(id, userId) VALUES (${socialUUID}, ${uuid})`
    await this.prisma
      .$executeRaw`INSERT INTO Contact(id, userId) VALUES (${contactUUID}, ${uuid})`

    this.logger.log(`Created user ${username}`)
    return result
  }
}
