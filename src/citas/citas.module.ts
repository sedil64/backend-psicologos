import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cita } from './citas.entity';
import { CitasService } from './citas.service';
import { CitasController } from './citas.controller';
import { Psicologo } from '../psicologos/psicologos.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cita, Psicologo])],
  providers: [CitasService],
  controllers: [CitasController],
})
export class CitasModule {}
