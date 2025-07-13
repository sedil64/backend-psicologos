import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CertificacionPsicologo, CertificacionPsicologoDocument } from './schemas/certificacion.schema';
import { Model } from 'mongoose';
import { CreateCertificacionDto } from './dto/create-certificacion.dto';

@Injectable()
export class CertificacionesService {
  constructor(
    @InjectModel(CertificacionPsicologo.name)
    private readonly certModel: Model<CertificacionPsicologoDocument>,
  ) {}

  async agregarCertificacion(psicologoId: number, dto: CreateCertificacionDto) {
    const registro = await this.certModel.findOne({ psicologoId });

    if (registro) {
      registro.certificaciones.push({
  ...dto,
  fechaExpedicion: dto.fechaExpedicion ? new Date(dto.fechaExpedicion) : undefined,
});
      return registro.save();
    }

    return this.certModel.create({
      psicologoId,
      certificaciones: [dto],
    });
  }

  async obtenerPorPsicologo(psicologoId: number) {
    return this.certModel.findOne({ psicologoId }).lean();
  }
}
