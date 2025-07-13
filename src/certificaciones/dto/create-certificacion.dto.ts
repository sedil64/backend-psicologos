import { IsString, IsOptional, IsDateString, IsBoolean } from 'class-validator';

export class CreateCertificacionDto {
  @IsString()
  titulo: string;

  @IsOptional()
  @IsString()
  institucion?: string;

  @IsOptional()
  @IsDateString()
  fechaExpedicion?: Date;

  @IsOptional()
  @IsString()
  archivoUrl?: string;

  @IsOptional()
  @IsBoolean()
  verificada?: boolean;
}
