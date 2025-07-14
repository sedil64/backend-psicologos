// src/citas/citas.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Cita } from './entities/citas.entity';
import { CitasService } from './citas.service';
import { CitasController } from './citas.controller';

import { PsicologosModule } from '../psicologos/psicologos.module';

@Module({
  imports: [
    // Registramos solo la entidad Cita, y traemos PsicologosModule
    TypeOrmModule.forFeature([Cita]),  
    PsicologosModule,                   
  ],
  providers: [CitasService],
  controllers: [CitasController],
})
export class CitasModule {}
