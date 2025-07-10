import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cita } from './citas.entity';
import { CitasService } from './citas.service';
import { CitasController } from './citas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Cita])],
  providers: [CitasService],
  controllers: [CitasController],
})
export class CitasModule {}
