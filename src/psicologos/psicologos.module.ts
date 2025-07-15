// src/psicologos/psicologos.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PsicologosController } from './psicologos.controller';
import { PsicologosService } from './psicologos.service';
import { Psicologo } from './entities/psicologos.entity';
import { Account } from '../auth/entities/account.entity';
import { Cita } from '../citas/entities/citas.entity';
import { Paciente } from '../pacientes/entities/paciente.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Psicologo, Account, Cita, Paciente]),
    // … otros módulos…
  ],
  controllers: [PsicologosController],
  providers: [PsicologosService],
})
export class PsicologosModule {}
