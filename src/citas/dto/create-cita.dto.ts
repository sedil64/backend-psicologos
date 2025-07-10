import { IsDateString, IsEnum, IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateCitaDto {
  @IsString()
  nombreCliente: string;

  @IsDateString()
  fecha: string;

  @IsEnum(['pendiente', 'confirmada', 'cancelada'])
  estado: 'pendiente' | 'confirmada' | 'cancelada';

  @IsInt()
  psicologoId: number;
}
