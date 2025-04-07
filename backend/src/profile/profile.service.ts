import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { Profile } from './entities/profile.entity'

@Injectable()
export class ProfileService {
  constructor(private readonly prismaService: PrismaService) {}

  async getProfile(userId: string): Promise<Profile> {
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
        ) AS social,
        JSON_OBJECT(
            'citizenId', Contact.citizenId,
            'phone', Contact.phone,
            'address', Contact.address,
            'city', Contact.city,
            'province', Contact.province,
            'zipCode', Contact.zipCode,
            'country', Contact.country
        ) as contact
    FROM User 
    LEFT JOIN Social ON Social.userId = User.id
    LEFT JOIN Contact ON Contact.userId = User.id
    WHERE User.id = ${userId}`
    return result[0]
  }
}
