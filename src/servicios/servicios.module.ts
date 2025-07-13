import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Servicio } from './servicios.entity';
import { ServiciosService } from './servicios.service';
import { ServiciosController } from './servicios.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Servicio])],
  providers: [ServiciosService],
  controllers: [ServiciosController],
})
export class ServiciosModule {}
