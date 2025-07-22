// src/disponibilidad/dto/crear-disponibilidad.dto.ts
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CrearDisponibilidadDto {
  @IsDateString()
  fecha: string;

  @IsNotEmpty()
  @IsString()
  horaInicio: string;

  @IsNotEmpty()
  @IsString()
  horaFin: string;
}
