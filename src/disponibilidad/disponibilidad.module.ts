import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Disponibilidad } from './entity/disponibilidad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Disponibilidad])],
  exports: [TypeOrmModule],
})
export class DisponibilidadModule {}
