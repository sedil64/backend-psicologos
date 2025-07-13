import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';

// Módulos personalizados
import { UsuariosModule } from './usuarios/usuarios.module';
import { ServiciosModule } from './servicios/servicios.module';
import { CitasModule } from './citas/citas.module';
import { AuthModule } from './auth/auth.module';
import { LogsModule } from './logs/logs.module';
import { PsicologosModule } from './psicologos/psicologos.module';
import { PacientesModule } from './pacientes/pacientes.module';

@Module({
  imports: [
    // Configuración global de variables de entorno
    ConfigModule.forRoot({ isGlobal: true }),

    // Conexión a MongoDB (Atlas)
    MongooseModule.forRoot(process.env.MONGO_URI || ''),

    // Conexión a PostgreSQL (Neon)
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

    // Módulos funcionales
    UsuariosModule,
    ServiciosModule,
    CitasModule,
    AuthModule,
    LogsModule,
    PsicologosModule,
    PacientesModule

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
