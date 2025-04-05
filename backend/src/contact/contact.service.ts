import { Injectable } from '@nestjs/common'
import { Contact } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { UpdateContactDto } from './dto/update-contact.dto'

@Injectable()
export class ContactService {
  constructor(private readonly prismaService: PrismaService) {}

  async getContacts() {
    return await this.prismaService.$queryRaw<Contact>`SELECT * FROM Contact`
  }

  async getContactByUser(userId: string) {
    return await this.prismaService.$queryRaw`
      SELECT * FROM Contact WHERE userId = ${userId}
    `
  }

  async editContact(id: string, contact: UpdateContactDto) {
    return await this.prismaService.$queryRaw`
      UPDATE Contact
      SET ${contact}
      WHERE id = ${id}
    `
  }
}
