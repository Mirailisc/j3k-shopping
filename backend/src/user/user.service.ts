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
import { Social } from 'src/social/entities/social.entity'
import { SocialService } from 'src/social/social.service'
import { ContactService } from 'src/contact/contact.service'
import { Contact } from 'src/contact/entities/contact.entity'

export type FullUserInfo = User & Social & Contact

@Injectable()
export class UserService {
  private logger: Logger = new Logger(UserService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly socialService: SocialService,
    private readonly contactService: ContactService,
  ) {}

  async getAllUser() {
    return await this.prisma.$queryRaw<FullUserInfo[]>`
      SELECT 
      U.id, U.username, U.email, U.firstName, U.lastName, U.isAdmin, U.isSuperAdmin,
      S.line, S.facebook, S.website, S.instagram, S.tiktok,
      C.phone, C.address, C.city, C.province, C.zipCode, C.country,
      U.createdAt
      FROM User U
      LEFT JOIN Social S ON U.id = S.userId
      LEFT JOIN Contact C ON U.id = C.userId
    `
  }

  async getFullUserById(userId: string) {
    const result = await this.prisma.$queryRaw<FullUserInfo[]>`
      SELECT 
      U.id, U.username, U.email, U.firstName, U.lastName, U.isAdmin, U.isSuperAdmin,
      S.line, S.facebook, S.website, S.instagram, S.tiktok,
      C.phone, C.address, C.city, C.province, C.zipCode, C.country,
      U.createdAt
      FROM User U
      LEFT JOIN Social S ON U.id = S.userId
      LEFT JOIN Contact C ON U.id = C.userId
      WHERE U.id = ${userId}
    `
    if (result.length === 0) {
      throw new NotFoundException(`User ${userId} not found`)
    }

    return result[0]
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

  async deleteUser(id: string, me: string) {
    if (id === me) {
      throw new BadRequestException('Cannot delete yourself')
    }

    await this.contactService.deleteContact(id)
    await this.socialService.deleteSocial(id)

    await this.prisma.$executeRaw<User>`
      DELETE FROM User WHERE User.id = ${id}
    `

    this.logger.log(`Deleted user ${id}`)
    return { message: `User ${id} has been deleted` }
  }

  async updateUser(id: string, updateUserDto: Omit<CreateUserDto, 'password'>) {
    const {
      username,
      email,
      firstName,
      lastName,
      isAdmin,
      isSuperAdmin,
      line,
      facebook,
      instagram,
      tiktok,
      website,
      phone,
      address,
      city,
      province,
      zipCode,
      country,
    } = updateUserDto

    const existingUsername = await this.prisma.$queryRaw<User>`
      SELECT * FROM User WHERE username = ${username} AND id != ${id}`
    const existingEmail = await this.prisma.$queryRaw<User>`
      SELECT * FROM User WHERE email = ${email} AND id != ${id}`

    if (existingUsername[0]) {
      throw new BadRequestException('Username already exists')
    }

    if (existingEmail[0]) {
      throw new BadRequestException('Email already exists')
    }

    await this.socialService.updateSocial(id, {
      line,
      facebook,
      instagram,
      tiktok,
      website,
    })

    await this.contactService.updateContact(id, {
      phone,
      address,
      city,
      province,
      zipCode,
      country,
    })

    await this.prisma.$executeRaw`
      UPDATE User 
      SET username = ${username}, email = ${email}, firstName = ${firstName}, lastName = ${lastName}, isAdmin = ${isAdmin}, isSuperAdmin = ${isSuperAdmin}
      WHERE id = ${id}
    `

    this.logger.log(`Updated user ${id}`)
    return await this.getFullUserById(id)
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
      line,
      facebook,
      instagram,
      tiktok,
      website,
      phone,
      address,
      city,
      province,
      zipCode,
      country,
    } = createUserDto

    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS)
    const uuid = randomUUID()
    const contactUUID = randomUUID()
    const socialUUID = randomUUID()

    const existingUsername = await this.prisma.$queryRaw<User>`
      SELECT * FROM User WHERE username = ${username}`
    const existingEmail = await this.prisma.$queryRaw<User>`
      SELECT * FROM User WHERE email = ${email}`

    if (existingUsername[0]) {
      throw new BadRequestException('Username already exists')
    }

    if (existingEmail[0]) {
      throw new BadRequestException('Email already exists')
    }

    await this.prisma.$executeRawUnsafe(
      `
      INSERT INTO User(id, username, email, firstName, lastName, isAdmin, isSuperAdmin, password)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      uuid,
      username,
      email,
      firstName,
      lastName,
      isAdmin,
      isSuperAdmin,
      hashedPassword,
    )

    await this.prisma
      .$executeRaw<Social>`INSERT INTO Social(id, userId, line, facebook, instagram, tiktok, website) VALUES (${socialUUID}, ${uuid}, ${line}, ${facebook}, ${instagram}, ${tiktok}, ${website})`
    await this.prisma
      .$executeRaw`INSERT INTO Contact(id, phone, address, city, province, zipCode, country, userId) VALUES (${contactUUID}, ${phone}, ${address}, ${city}, ${province}, ${zipCode}, ${country}, ${uuid})`

    return await this.getFullUserById(uuid)
  }

  async resetPassword(userId: string, current: string, newPassword: string) {
    const user = await this.getUserById(userId)
    const isPasswordMatch = await bcrypt.compare(current, user.password)

    if (isPasswordMatch) {
      const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS)
      await this.prisma.$executeRaw`
        UPDATE User 
        SET password = ${hashedPassword}
        WHERE id = ${userId}
      `

      this.logger.log(`Reset password for user ${userId}`)
      return await this.getFullUserById(userId)
    } else {
      throw new BadRequestException('Current password is incorrect')
    }
  }
}
