import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { ConfigModule } from '@nestjs/config'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { isDev } from './config/env'

@Module({
  imports: [
    AuthModule,
    UserModule,
    ConfigModule.forRoot(),
    !isDev &&
      ServeStaticModule.forRoot({
        rootPath: join(__dirname, '..', 'public'),
        serveRoot: '/',
      }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
