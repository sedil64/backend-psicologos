import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateServicioDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  descripcion: string;

  @IsNumber()
  precio: number;

  @IsNotEmpty()
  psicologoId: number;
}
