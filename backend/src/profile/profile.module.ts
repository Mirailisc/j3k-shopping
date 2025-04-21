import { Module } from '@nestjs/common'
import { ProfileService } from './profile.service'
import { ProfileController } from './profile.controller'
import { PrismaService } from 'src/prisma/prisma.service'
import { ContactService } from 'src/contact/contact.service'

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, PrismaService, ContactService],
})
export class ProfileModule {}
