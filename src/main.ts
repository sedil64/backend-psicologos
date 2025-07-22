import * as crypto from 'crypto';
import * as express from 'express';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  // Polyfill para global.crypto (algunas dependencias lo requieren)
  if (!(global as any).crypto) {
    (global as any).crypto = crypto;
  }

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // MIDDLEWARE opcional para logging de peticiones
  app.use((req, res, next) => {
    console.log('>> Incoming:', req.method, req.url, req.headers.authorization);
    next();
  });

  // CORS: permite dominios específicos (frontend autorizado)
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://desarrollo-software.xyz',
      'https://front-end-psicologos.vercel.app',
      'https://resultados-deportivos-backend.onrender.com',
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    transform: true,
  });

  // Sirve archivos estáticos desde /uploads (fotos, documentos, etc.)
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  // Validación global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,           
      forbidNonWhitelisted: true, 
    }),
  );
 
  const port = process.env.PORT || 3006;
  await app.listen(port, '0.0.0.0');
  console.log(`Servidor escuchando ${port}`);
}
bootstrap();