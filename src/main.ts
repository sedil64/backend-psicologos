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

  const app = await NestFactory.create(AppModule);

  // CORS configurado para frontend HTTPS desde NGINX
  app.enableCors({
  origin: [
    'https://resultados-deportivos-backend.desarrollo-software.xyz',
    'https://desarrollo-software.xyz',
    'http://localhost:5173', // solo si sigues probando localmente
  ],
    credentials: true,
  });

  // Validación global de DTOs
  app.useGlobalPipes(new ValidationPipe());

  // Guards de autenticación y roles
  const reflector = app.get(Reflector);
  app.useGlobalGuards(
    new JwtAuthGuard(reflector),
    new RolesGuard(reflector)
  );

  // Escucha desde todas las interfaces (VPS y proxy)
  await app.listen(process.env.PORT || 3006, '0.0.0.0');
}
bootstrap();
