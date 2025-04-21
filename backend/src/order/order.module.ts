import { Module } from '@nestjs/common'
import { OrderService } from './order.service'
import { OrderController } from './order.controller'
import { PrismaService } from 'src/prisma/prisma.service'
import { ProductService } from 'src/product/product.service'
import { UserService } from 'src/user/user.service'
import { SocialService } from 'src/social/social.service'
import { ContactService } from 'src/contact/contact.service'
import { NotificationService } from 'src/notification/notification.service'

@Module({
  controllers: [OrderController],
  providers: [
    OrderService,
    PrismaService,
    ProductService,
    UserService,
    SocialService,
    ContactService,
    NotificationService,
  ],
})
export class OrderModule {}
