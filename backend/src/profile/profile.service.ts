import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class ProfileService {
  constructor(private readonly prismaService: PrismaService) {}

  async getProfile(userId: string) {
    const result = await this.prismaService.$queryRaw`
    SELECT 
        User.username, 
        User.firstName, 
        User.lastName, 
        User.isAdmin,
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
}
