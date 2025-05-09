import { Module } from '@nestjs/common'
import { DashboardService } from './dashboard.service'
import { DashboardController } from './dashboard.controller'
import { PrismaService } from 'src/prisma/prisma.service'
import { UserService } from 'src/user/user.service'
import { SocialService } from 'src/social/social.service'
import { ContactService } from 'src/contact/contact.service'

@Module({
  controllers: [DashboardController],
  providers: [
    DashboardService,
    PrismaService,
    UserService,
    SocialService,
    ContactService,
  ],
})
export class DashboardModule {}
