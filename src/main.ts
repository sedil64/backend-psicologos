import * as crypto from 'crypto';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { RolesGuard } from './common/guards/roles.guard';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  // Compatibilidad con dependencias que requieren global.crypto
  if (!(global as any).crypto) {
    (global as any).crypto = crypto;
  }

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });
  

  // CORS: permite dominios HTTPS servidos por NGINX o frontend local
  app.enableCors({
    origin: [
      'https://resultados-deportivos-backend.desarrollo-software.xyz', // backend detrás de NGINX
      'https://desarrollo-software.xyz', // posible frontend
      'http://localhost:5173', // desarrollo local
    ],
    credentials: true,
  });

  // Validación global de DTOs
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  // Escucha externa en VPS o contenedor
  await app.listen(process.env.PORT || 3006, '0.0.0.0');
}

bootstrap();
