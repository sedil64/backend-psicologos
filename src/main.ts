// src/main.ts
import * as crypto from 'crypto';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
  // polyfill para dependencias que usan global.crypto
  if (!(global as any).crypto) {
    (global as any).crypto = crypto;
  }

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // MIDDLEWARE de logging (opcional)
  app.use((req, res, next) => {
    console.log('>> Incoming:', req.method, req.url, req.headers.authorization);
    next();
  });

  // CORS: SOLO el dominio de tu FRONTEND, no el backend
  app.enableCors({
    origin: [
      'http://localhost:5173',                 
      'https://desarrollo-software.xyz',
      'https://front-end-psicologos.vercel.app'
    ],
    methods: ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization'],
    credentials: true,
    transform: true,  // solo si ENVIAS cookies o auth basada en sesión
  });

  // Valida los DTOs globally
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  const port = process.env.PORT || 3006;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Server listening on http://0.0.0.0:${port}`);
}
bootstrap();
