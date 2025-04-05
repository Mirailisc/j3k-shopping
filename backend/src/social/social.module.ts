import { Module } from '@nestjs/common'
import { SocialService } from './social.service'
import { SocialController } from './social.controller'
import { PrismaService } from 'src/prisma/prisma.service'
import { UserService } from 'src/user/user.service'

@Module({
  controllers: [SocialController],
  providers: [SocialService, PrismaService, UserService],
})
export class SocialModule {}
