import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule }      from '@nestjs/typeorm';
import { CitasController }    from './citas.controller';
import { CitasService }       from './citas.service';
import { Cita }               from './entities/citas.entity';
import { PsicologosModule }   from '../psicologos/psicologos.module';
import { PacientesModule }    from '../pacientes/pacientes.module';
import { DisponibilidadModule } from '../disponibilidad/disponibilidad.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cita]),
    DisponibilidadModule,
    forwardRef(() => PsicologosModule),  // ← para inyectar PsicologosService
    forwardRef(() => PacientesModule),   // ← para inyectar PacientesService
  ],
  controllers: [CitasController],
  providers:   [CitasService],
  exports:    [CitasService],           // ← exporta si otro módulo lo necesita
})
export class CitasModule {}
