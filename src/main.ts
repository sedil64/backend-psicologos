import * as crypto from 'crypto';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AppModule } from './app.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';

async function bootstrap() {
  // polyfill para dependencias que usan global.crypto
  if (!(global as any).crypto) {
    (global as any).crypto = crypto;
  }

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // MIDDLEWARE: loggeo de headers para depurar Authorization
  app.use((req, res, next) => {
    console.log('>> Incoming request:', req.method, req.url);
    console.log('>> Headers.authorization:', req.headers.authorization);
    next();
  });

  // CORS permitido (ajusta orígenes según necesites)
  app.enableCors({
    origin: [
      'https://resultados-deportivos-backend.desarrollo-software.xyz',
      'https://desarrollo-software.xyz',
      'http://localhost:5173',
    ],
    credentials: true,
  });

  // Pipes globales para validar DTOs
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  // Si quisieras activar el guard globalmente, descomenta:
  // const reflector = app.get(Reflector);
  // app.useGlobalGuards(
  //   new JwtAuthGuard(reflector),
  //   new RolesGuard(reflector),
  // );

  // Levanta servidor en todas las interfaces
  const port = process.env.PORT || 3006;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Application is running on: http://0.0.0.0:${port}`);
}

bootstrap();
