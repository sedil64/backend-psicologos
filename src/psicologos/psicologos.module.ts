// src/psicologos/psicologos.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Psicologo } from './psicologos.entity';
import { PsicologosService } from './psicologos.service';
import { PsicologosController } from './psicologos.controller';
import { CertificacionesModule } from '../certificaciones/certificaciones.module'; // 👈 Importar MongoModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Psicologo]),
    CertificacionesModule, // 👈 Aquí habilitas el acceso a certificaciones
  ],
  providers: [PsicologosService],
  controllers: [PsicologosController],
  exports: [PsicologosService],
})
export class PsicologosModule {}
