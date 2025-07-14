import { Module } from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsuariosModule } from './usuarios/usuarios.module';
import { ServiciosModule } from './servicios/servicios.module';
import { CitasModule } from './citas/citas.module';
import { AuthModule } from './auth/auth.module';
import { LogsModule } from './logs/logs.module';
import { PsicologosModule } from './psicologos/psicologos.module';
import { PacientesModule } from './pacientes/pacientes.module';
import { AdminModule } from './admin/admin.module';

import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
// Importa RolesGuard pero NO lo registramos como global

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI || ''),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT') || '5432', 10),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASS'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: process.env.NODE_ENV !== 'production',
        ssl: { rejectUnauthorized: false },
        extra: { ssl: true },
      }),
      inject: [ConfigService],
    }),
    UsuariosModule,
    ServiciosModule,
    CitasModule,
    AuthModule,
    LogsModule,
    PsicologosModule,
    PacientesModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useFactory: (reflector: Reflector) => new JwtAuthGuard(reflector),
      inject: [Reflector],
    },
    // NO poner RolesGuard aquí como APP_GUARD
  ],
})
export class AppModule {}
