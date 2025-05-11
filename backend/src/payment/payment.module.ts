import { Module } from '@nestjs/common'
import { PaymentService } from './payment.service'
import { PaymentController } from './payment.controller'
import { ProductService } from 'src/product/product.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { OrderService } from 'src/order/order.service'
import { ProfileService } from 'src/profile/profile.service'
import { NotificationService } from 'src/notification/notification.service'
import { ContactService } from 'src/contact/contact.service'

// @Module({
//   controllers: [PaymentController],
//   providers: [
//     PaymentService,
//     ProductService,
//     PrismaService,
//     OrderService,
//     ProfileService,
//     NotificationService,
//     ContactService,
//   ],
// })

export class PaymentModule {}
