import { Module } from '@nestjs/common'
import { ReportService } from './report.service'
import { ReportController } from './report.controller'
import { PrismaService } from 'src/prisma/prisma.service'
import { UserService } from 'src/user/user.service'
import { SocialService } from 'src/social/social.service'
import { ContactService } from 'src/contact/contact.service'


@Module({
  controllers: [ReportController],
  providers: [ReportService, 
    PrismaService, 
    UserService,
    SocialService,
    ContactService,
  ],
})
export class ReportModule {}
