import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { UpdateContactDto } from './dto/update-contact.dto'
import { Contact } from './entities/contact.entity'

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  async getContactByUsername(username: string) {
    const contact = await this.prisma.$queryRaw<Contact[]>`
      SELECT * FROM Contact WHERE userId = (
        SELECT id FROM User WHERE username = ${username}
      )
    `

    if (contact.length === 0) {
      throw new NotFoundException('User contact not found')
    }

    return {
      phone: contact[0].phone,
      address: contact[0].address,
      city: contact[0].city,
      province: contact[0].province,
      zipCode: contact[0].zipCode,
      country: contact[0].country,
    }
  }

  async updateContact(id: string, contact: UpdateContactDto) {
    return await this.prisma.$executeRaw`
      UPDATE Contact
      SET
      phone = ${contact.phone},
      address = ${contact.address},
      city = ${contact.city},
      province = ${contact.province},
      zipCode = ${contact.zipCode},
      country = ${contact.country}
      WHERE userId = ${id}
    `
  }

  async deleteContact(id: string) {
    return await this.prisma.$executeRaw`
      DELETE FROM Contact WHERE userId = ${id}
    `
  }
}
