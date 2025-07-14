// src/psicologos/psicologos.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { CertificacionesModule } from '../certificaciones/certificaciones.module';

import { Psicologo } from './entities/psicologos.entity';
import { Account } from '../auth/entities/account.entity';

import { PsicologosService } from './psicologos.service';
import { PsicologosController } from './psicologos.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Psicologo, Account]),
    AuthModule,
    CertificacionesModule,
  ],
  providers: [PsicologosService],
  controllers: [PsicologosController],
  exports: [PsicologosService],
})
export class PsicologosModule {}
