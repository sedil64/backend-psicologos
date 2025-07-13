import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';

export class UpdateCitaDto {
  @IsOptional()
  @IsString()
  nombreCliente?: string;

  @IsOptional()
  @IsDateString()
  fecha?: Date;

  @IsOptional()
  @IsEnum(['pendiente', 'confirmada', 'cancelada'])
  estado?: 'pendiente' | 'confirmada' | 'cancelada';
}
