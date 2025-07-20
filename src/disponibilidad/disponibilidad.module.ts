// src/disponibilidad/disponibilidad.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Disponibilidad } from './entity/disponibilidad.entity';
import { DisponibilidadController } from './disponibilidad.controller';
import { DisponibilidadService } from './disponibilidad.service';
import { Psicologo } from '../psicologos/entities/psicologos.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Disponibilidad, Psicologo]),
  ],
  controllers: [DisponibilidadController],
  providers: [DisponibilidadService],
  exports: [DisponibilidadService],
})
export class DisponibilidadModule {}
