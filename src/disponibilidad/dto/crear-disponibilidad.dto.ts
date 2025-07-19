import { IsDateString, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CrearDisponibilidadDto {
  @IsDateString()
  @IsNotEmpty()
  fecha: string;       // ISO: yyyy-mm-dd

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Hora inicio inválida (HH:mm)',
  })
  horaInicio: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Hora fin inválida (HH:mm)',
  })
  horaFin: string;
}
