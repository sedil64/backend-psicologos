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

  app.use((req, res, next) => {
    console.log('>> Incoming:', req.method, req.url, req.headers.authorization);
    next();
  });


  app.enableCors({


  origin: (origin, callback) => {
    callback(null, true); 
  },

    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    transform: true,
  });


  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

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