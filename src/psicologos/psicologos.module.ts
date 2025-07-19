// src/psicologos/psicologos.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PsicologosController } from './psicologos.controller';
import { PsicologosService } from './psicologos.service';

import { Psicologo } from './entities/psicologos.entity';
import { Account } from '../auth/entities/account.entity';
import { Cita } from '../citas/entities/citas.entity';
import { Paciente } from '../pacientes/entities/paciente.entity';
import { Disponibilidad } from '../disponibilidad/entity/disponibilidad.entity'; // ✅ FALTA ESTO

import { AuthModule } from '../auth/auth.module';
import { CertificacionesModule } from '../certificaciones/certificaciones.module';
import { CitasModule } from '../citas/citas.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Psicologo,
      Account,
      Cita,
      Paciente,
      Disponibilidad, // ✅ AGREGA ESTO
    ]),
    AuthModule,
    CertificacionesModule,
    forwardRef(() => CitasModule),
  ],
  controllers: [PsicologosController],
  providers: [PsicologosService],
  exports: [PsicologosService],
})
export class PsicologosModule {}
