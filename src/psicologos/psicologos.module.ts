// src/psicologos/psicologos.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';                   // ← importa AuthModule
import { Account } from '../auth/entities/account.entity';         // ← importa Account
import { CertificacionesModule } from '../certificaciones/certificaciones.module';

import { Psicologo } from './entities/psicologos.entity';
import { PsicologosService } from './psicologos.service';
import { PsicologosController } from './psicologos.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Psicologo, Account]),               // ← añade Account aquí
    AuthModule,                                                   // ← añade AuthModule aquí
    CertificacionesModule,
  ],
  controllers: [PsicologosController],
  providers: [PsicologosService],
  exports: [PsicologosService],
})
export class PsicologosModule {}
