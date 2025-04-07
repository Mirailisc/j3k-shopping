import { Module } from '@nestjs/common'
import { ProductService } from './product.service'
import { ProductController } from './product.controller'
import { PrismaService } from 'src/prisma/prisma.service'
import { UserService } from 'src/user/user.service'
import { SocialService } from 'src/social/social.service'
import { ContactService } from 'src/contact/contact.service'

@Module({
  controllers: [ProductController],
  providers: [
    ProductService,
    PrismaService,
    UserService,
    SocialService,
    ContactService,
  ],
})
export class ProductModule {}
