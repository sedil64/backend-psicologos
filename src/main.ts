import * as crypto from 'crypto';  // Importa crypto primero
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // Inyecta crypto en global si no existe
  if (!(global as any).crypto) {
    (global as any).crypto = crypto;
  }

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
