// src/citas/citas.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule }         from '@nestjs/typeorm';

import { Cita }                  from './entities/citas.entity';
import { Disponibilidad }        from '../disponibilidad/entity/disponibilidad.entity';

import { CitasController }       from './citas.controller';
import { CitasService }          from './citas.service';
import { PsicologosModule }      from '../psicologos/psicologos.module';
import { PacientesModule }       from '../pacientes/pacientes.module';
// ✅ Importa el módulo de disponibilidades:
import { DisponibilidadModule }  from '../disponibilidad/disponibilidad.module';

@Module({
  imports: [
    // Registramos ambos repositorios aquí
    TypeOrmModule.forFeature([Cita, Disponibilidad]),

    // para PsicologosService y PacientesService
    forwardRef(() => PsicologosModule),
    forwardRef(() => PacientesModule),

    // **quita** el TypeOrmModule.forFeature([Disponibilidad]) *si* importas el módulo,
    // o bien déjalo y elimina este import y usa sólo el módulo:
    DisponibilidadModule,
  ],
  controllers: [CitasController],
  providers:   [CitasService],
  exports:     [CitasService],
})
export class CitasModule {}
