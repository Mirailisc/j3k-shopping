import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { PrismaService } from 'src/prisma/prisma.service'
import { ContactService } from 'src/contact/contact.service'
import { SocialService } from 'src/social/social.service'

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, ContactService, SocialService],
  exports: [UserService],
})
export class UserModule {}
