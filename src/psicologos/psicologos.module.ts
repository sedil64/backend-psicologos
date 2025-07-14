// src/psicologos/psicologos.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';                                 // ← importar AuthModule
import { Account } from '../auth/entities/account.entity';                         // ← entidad Account
import { CertificacionesModule } from '../certificaciones/certificaciones.module';

import { Psicologo } from './entities/psicologos.entity';
import { PsicologosService } from './psicologos.service';
import { PsicologosController } from './psicologos.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Psicologo, Account]),                              // ← registra repositorios
    AuthModule,                                                                  // ← permite inyectar AuthService
    CertificacionesModule,
  ],
  controllers: [PsicologosController],
  providers: [PsicologosService],
  exports: [PsicologosService],
})
export class PsicologosModule {}
