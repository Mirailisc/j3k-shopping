import { Module } from '@nestjs/common'
import { ReviewService } from './review.service'
import { ReviewController } from './review.controller'
import { PrismaService } from 'src/prisma/prisma.service'
import { UserService } from 'src/user/user.service'
import { SocialService } from 'src/social/social.service'
import { ContactService } from 'src/contact/contact.service'

@Module({
  controllers: [ReviewController],
  providers: [
    ReviewService,
    PrismaService,
    UserService,
    SocialService,
    ContactService,
  ],
})
export class ReviewModule {}
