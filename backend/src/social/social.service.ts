import { Injectable } from '@nestjs/common'
import { Social } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { UpdateSocialDto } from './dto/update-social.dto'

@Injectable()
export class SocialService {
  constructor(private readonly prismaService: PrismaService) {}

  async getSocials() {
    return await this.prismaService.$queryRaw<Social>`SELECT * FROM Social`
  }

  async getSocialByUser(userId: string) {
    return await this.prismaService.$queryRaw`
          SELECT * FROM Social WHERE userId = ${userId}
        `
  }

  async editSocial(id: string, social: UpdateSocialDto) {
    return await this.prismaService.$queryRaw`
          UPDATE Social
          SET ${social}
          WHERE id = ${id}
        `
  }
}
