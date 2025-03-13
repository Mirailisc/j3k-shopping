import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DEFAULT_PORT, isDev } from './config/env'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { NestExpressApplication } from '@nestjs/platform-express'
import * as cookieParser from 'cookie-parser'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  const config = new DocumentBuilder()
    .setTitle('Chinese Scammer API')
    .setDescription('The Chinese Scammer API documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs/swagger', app, documentFactory)

  app.setGlobalPrefix('api/v2')
  app.useGlobalPipes(new ValidationPipe())
  app.use(cookieParser())
  app.enableCors({
    origin: isDev ? 'http://localhost:3000' : 'https://j3k.arius.cloud',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    optionsSuccessStatus: 204,
  })
  await app.listen(process.env.PORT ?? DEFAULT_PORT)
}
bootstrap()
