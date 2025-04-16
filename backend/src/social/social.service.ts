import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { UpdateSocialDto } from './dto/update-social.dto'
import { Social } from './entities/social.entity'

@Injectable()
export class SocialService {
  constructor(private readonly prisma: PrismaService) {}

  async getSocialByUsername(username: string) {
    const social = await this.prisma.$queryRaw<Social[]>`
          SELECT * FROM Social WHERE userId = (
            SELECT id FROM User WHERE username = ${username}
          )
        `

    if (social.length === 0) {
      throw new NotFoundException('User social not found')
    }

    return {
      line: social[0].line,
      facebook: social[0].facebook,
      instagram: social[0].instagram,
      tiktok: social[0].tiktok,
      website: social[0].website,
    }
  }

  async updateSocial(id: string, social: UpdateSocialDto) {
    return await this.prisma.$executeRaw`
      UPDATE Social
      SET
      line = ${social.line},
      facebook = ${social.facebook},
      instagram = ${social.instagram},
      tiktok = ${social.tiktok},
      website = ${social.website}
      WHERE userId = ${id}
    `
  }

  async deleteSocial(id: string) {
    await this.prisma.$executeRaw`DELETE FROM Social WHERE userId = ${id}`
  }
}
