import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Paciente } from './entities/paciente.entity';
import { PacientesService } from './pacientes.service';
import { PacientesController } from './pacientes.controller';

import { AuthModule } from '../auth/auth.module';
import { CitasModule }       from '../citas/citas.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Paciente]),
    AuthModule,
    forwardRef(() => CitasModule),
  ],
  providers: [PacientesService],
  controllers: [PacientesController],
  exports: [PacientesService],
})
export class PacientesModule {}
