// src/citas/dto/create-cita.dto.ts
import { IsString, IsDateString, IsNumber } from 'class-validator';

export class CreateCitaDto {
  @IsString()
  nombreCliente: string;

  @IsDateString()
  fecha: Date;         // se validará como ISO string, pero TS lo trata como Date

  @IsString()
  hora: string;        // formato "HH:MM:SS"

  @IsNumber()
  psicologoId: number;
}
