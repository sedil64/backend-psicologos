import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Disponibilidad } from './entity/disponibilidad.entity';
import { DisponibilidadController } from './disponibilidad.controller';
import { DisponibilidadService } from './disponibilidad.service';

@Module({
  imports: [TypeOrmModule.forFeature([Disponibilidad])],
  controllers: [DisponibilidadController],   // AGREGAR controlador
  providers: [DisponibilidadService],       // AGREGAR servicio
  exports: [TypeOrmModule],                  // puedes dejar o quitar exports según uso
})
export class DisponibilidadModule {}
