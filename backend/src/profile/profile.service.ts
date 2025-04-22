import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { Profile } from './entities/profile.entity'
import { UpdateContactDto } from 'src/contact/dto/update-contact.dto'
import { ContactService } from 'src/contact/contact.service'

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly contactService: ContactService,
  ) {}

  async getProfile(userId: string): Promise<Profile> {
    const result = await this.prisma.$queryRaw`
    SELECT 
        User.username, 
        User.firstName, 
        User.lastName, 
        User.isAdmin,
        User.isSuperAdmin,
        User.email,
        JSON_OBJECT(
            'line', Social.line, 
            'facebook', Social.facebook, 
            'website', Social.website, 
            'instagram', Social.instagram, 
            'tiktok', Social.tiktok
        ) AS social
    FROM User 
    LEFT JOIN Social ON Social.userId = User.id
    WHERE User.id = ${userId}`
    return result[0]
  }

  async getProfileByUsername(username: string) {
    const result = await this.prisma.$queryRaw<Profile[]>`
    SELECT 
        User.username, 
        User.firstName, 
        User.lastName, 
        User.isAdmin,
        User.isSuperAdmin,
        User.email,
        JSON_OBJECT(
            'line', Social.line, 
            'facebook', Social.facebook, 
            'website', Social.website, 
            'instagram', Social.instagram, 
            'tiktok', Social.tiktok
        ) AS social
    FROM User 
    LEFT JOIN Social ON Social.userId = User.id
    WHERE User.username = ${username}`

    if (result.length === 0) {
      throw new NotFoundException('User not found')
    }

    return result[0]
  }

  async getShippingInfo(userId: string) {
    const result = await this.prisma.$queryRaw`
    SELECT 
    User.firstName,
    User.lastName,
    User.email,
    JSON_OBJECT(
        'phone', Contact.phone, 
        'address', Contact.address, 
        'city', Contact.city, 
        'province', Contact.province, 
        'zipCode', Contact.zipCode, 
        'country', Contact.country
    ) AS contact
    FROM User 
    LEFT JOIN Contact ON Contact.userId = User.id 
    WHERE User.id = ${userId}`

    return result[0]
  }

  async updateShippingInfo(
    userId: string,
    info: UpdateContactDto & {
      firstName: string
      lastName: string
    },
  ) {
    const contact = {
      phone: info.phone,
      address: info.address,
      city: info.city,
      province: info.province,
      zipCode: info.zipCode,
      country: info.country,
    }

    await this.contactService.updateContact(userId, contact)
    await this.prisma.$executeRaw`
      UPDATE User
      SET 
        firstName = ${info.firstName},
        lastName = ${info.lastName}
      WHERE id = ${userId}
    `

    return this.getShippingInfo(userId)
  }
}
