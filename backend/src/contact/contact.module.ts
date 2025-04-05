import { Module } from '@nestjs/common'
import { ContactService } from './contact.service'
import { ContactController } from './contact.controller'
import { PrismaService } from 'src/prisma/prisma.service'
import { UserService } from 'src/user/user.service'

@Module({
  controllers: [ContactController],
  providers: [ContactService, PrismaService, UserService],
})
export class ContactModule {}
