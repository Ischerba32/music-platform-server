import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';

const start = async () => {
  try {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const PORT = configService.get('PORT');
    app.use(cookieParser());
    app.enableCors({
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    });
    await app.listen(PORT, () => console.log(`Server started on ${PORT} port`));
  } catch (error) {
    console.log(error);
  }
};

start();
