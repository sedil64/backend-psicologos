import { IsString, IsDateString, IsEnum, IsNumber } from 'class-validator';

export class CreateCitaDto {
  @IsString()
  nombreCliente: string;

  @IsDateString()
  fecha: Date;

  @IsEnum(['pendiente', 'confirmada', 'cancelada'])
  estado: 'pendiente' | 'confirmada' | 'cancelada';

  @IsNumber()
  psicologoId: number;
}
