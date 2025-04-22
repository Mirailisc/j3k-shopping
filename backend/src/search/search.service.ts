import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async searchUsers(search: string) {
    return await this.prisma.user.findMany({
      where: {
        username: {
          contains: search,
        },
      },
      select: {
        id: true,
        username: true,
      },
      take: 10,
    })
  }
}
