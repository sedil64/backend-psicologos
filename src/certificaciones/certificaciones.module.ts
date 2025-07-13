import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CertificacionPsicologo, CertificacionPsicologoSchema } from './schemas/certificacion.schema';
import { CertificacionesService } from './certificaciones.service';
import { CertificacionesController } from './certificaciones.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CertificacionPsicologo.name, schema: CertificacionPsicologoSchema },
    ]),
  ],
  providers: [CertificacionesService],
  controllers: [CertificacionesController],
})
export class CertificacionesModule {}
