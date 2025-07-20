// src/disponibilidad/disponibilidad.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule }        from '@nestjs/typeorm';

import { Disponibilidad }       from './entity/disponibilidad.entity';
import { DisponibilidadService }from './disponibilidad.service';
import { DisponibilidadController } from './disponibilidad.controller';

// Importa también la entidad Psicologo
import { Psicologo }            from '../psicologos/entities/psicologos.entity';
// (opcional) para romper ciclos si PsicologosModule importa DisponibilidadModule
import { PsicologosModule }     from '../psicologos/psicologos.module';

@Module({
  imports: [
    // Registras ambos repositorios aquí
    TypeOrmModule.forFeature([Disponibilidad, Psicologo]),
    // Si PsicologosModule importa DisponibilidadModule también, rompe el ciclo:
    forwardRef(() => PsicologosModule),
  ],
  controllers: [DisponibilidadController],
  providers:   [DisponibilidadService],
  exports:     [DisponibilidadService],
})
export class DisponibilidadModule {}
