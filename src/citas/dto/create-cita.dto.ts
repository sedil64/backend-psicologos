import { IsString, IsDateString, IsInt } from 'class-validator';

export class CreateCitaDto {
  @IsString()
  nombreCliente: string;

  @IsDateString()
  fecha: string;       // formato ISO: YYYY-MM-DD

  @IsString()
  hora: string;        // formato HH:MM:SS

  @IsInt()
  psicologoId: number; // ID del psicólogo

  @IsInt()
  pacienteId: number;  // ID del paciente
}
