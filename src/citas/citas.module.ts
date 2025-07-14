import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Cita } from './entities/citas.entity';
import { CitasService } from './citas.service';
import { CitasController } from './citas.controller';

import { PsicologosModule } from '../psicologos/psicologos.module';
import { PacientesModule }  from '../pacientes/pacientes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cita]),
    PsicologosModule,
    PacientesModule,
  ],
  providers: [CitasService],
  controllers: [CitasController],
})
export class CitasModule {}
