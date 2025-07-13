import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CertificacionPsicologoDocument = CertificacionPsicologo & Document;

@Schema({ timestamps: true })
export class CertificacionPsicologo {
  @Prop({ required: true })
  psicologoId: number; // ID del psicólogo desde PostgreSQL

  @Prop([
    {
      titulo: { type: String, required: true },
      institucion: { type: String },
      fechaExpedicion: { type: Date },
      archivoUrl: { type: String },
      verificada: { type: Boolean, default: false },
    },
  ])
  certificaciones: Array<{
    titulo: string;
    institucion?: string;
    fechaExpedicion?: Date;
    archivoUrl?: string;
    verificada?: boolean;
  }>;
}

export const CertificacionPsicologoSchema = SchemaFactory.createForClass(CertificacionPsicologo);
