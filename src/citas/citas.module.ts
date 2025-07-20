// src/citas/citas.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule }      from '@nestjs/typeorm';

import { Cita }               from './entities/citas.entity';
import { Disponibilidad }     from '../disponibilidad/entity/disponibilidad.entity';
import { CitasService }       from './citas.service';
import { CitasController }    from './citas.controller';

import { PsicologosModule }   from '../psicologos/psicologos.module';
import { PacientesModule }    from '../pacientes/pacientes.module';

@Module({
  imports: [
    // ← Aquí debes incluir **las dos** entidades
    TypeOrmModule.forFeature([Cita, Disponibilidad]),

    // Si PsicologosModule y PacientesModule se importan mutuamente,
    // usa forwardRef para romper el ciclo:
    forwardRef(() => PsicologosModule),
    forwardRef(() => PacientesModule),
  ],
  controllers: [CitasController],
  providers:   [CitasService],
  exports:     [CitasService],
})
export class CitasModule {}
