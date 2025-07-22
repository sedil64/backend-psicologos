import { IsString, IsDateString, IsInt, IsOptional } from 'class-validator';

export class CreateCitaDto {
  @IsString()
  nombreCliente: string;

  @IsDateString()
  fecha: string;

  @IsString()
  hora: string;

  @IsInt()
  psicologoId: number;

  @IsInt()
  pacienteId: number;

  @IsOptional()
  @IsInt()
  disponibilidadId?: number;
}
