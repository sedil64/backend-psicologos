import * as crypto from 'crypto';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { RolesGuard } from './common/guards/roles.guard';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  if (!(global as any).crypto) {
    (global as any).crypto = crypto;
  }

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  // Validación global de DTOs
  app.useGlobalPipes(new ValidationPipe());

  // Guards globales para roles y JWT
  const reflector = app.get(Reflector);
/*  app.useGlobalGuards(
    new JwtAuthGuard(reflector),
    new RolesGuard(reflector)
  );

  */
  await app.listen(process.env.PORT || 3006);
}
bootstrap();
