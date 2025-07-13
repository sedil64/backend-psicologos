import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paciente } from './paciente.entity';
import { PacientesService } from './pacientes.service';
import { PacientesController } from './pacientes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Paciente])],
  providers: [PacientesService],
  controllers: [PacientesController],
  exports: [PacientesService],
})
export class PacientesModule {}
