import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { ConfigModule } from '@nestjs/config'
import { ProfileModule } from './profile/profile.module'
import { SocialModule } from './social/social.module'
import { ContactModule } from './contact/contact.module'
import { ProductModule } from './product/product.module'
import { OrderModule } from './order/order.module'
import { FeedModule } from './feed/feed.module'
import { ReviewModule } from './review/review.module'

@Module({
  imports: [
    AuthModule,
    UserModule,
    ConfigModule.forRoot(),
    ProfileModule,
    SocialModule,
    ContactModule,
    ProductModule,
    OrderModule,
    FeedModule,
    ReviewModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
