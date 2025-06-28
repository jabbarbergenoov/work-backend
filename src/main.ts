import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🟢 Добавь это СРАЗУ ПОСЛЕ create()
app.use('/uploads', express.static(join(__dirname, '..', 'uploads'))); // ✅ путь совпадает с Multer

  // ❗️После статики!
  app.setGlobalPrefix('/api');

  // остальное:
  const reflector = app.get(Reflector);
  const jwtService = app.get(JwtService);
  app.useGlobalGuards(new JwtAuthGuard(jwtService, reflector));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors();

  await app.listen(7777);
}
bootstrap();
