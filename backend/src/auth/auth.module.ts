import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UserService } from 'src/user/user.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { JwtModule } from '@nestjs/jwt'
import { DEFAULT_JWT_SECRET, JWT_EXPIRE_TIME } from 'src/config/jwt'
import { JwtStrategy } from './jwt.strategy'
import { SocialModule } from 'src/social/social.module'
import { ContactModule } from 'src/contact/contact.module'

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || DEFAULT_JWT_SECRET,
      signOptions: { expiresIn: JWT_EXPIRE_TIME },
    }),
    SocialModule,
    ContactModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, PrismaService, JwtStrategy],
})
export class AuthModule {}
