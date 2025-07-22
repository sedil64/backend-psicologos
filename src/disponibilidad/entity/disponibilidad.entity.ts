// src/disponibilidad/entity/disponibilidad.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Psicologo } from '../../psicologos/entities/psicologos.entity';

export enum EstadoDisponibilidad {
  Libre = 'libre',
  Reservado = 'reservado',
  Cancelado = 'cancelado',
}

@Entity('disponibilidades')
export class Disponibilidad {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Psicologo, psicologo => psicologo.disponibilidades, { onDelete: 'CASCADE' })
  psicologo: Psicologo;

  @Column({ type: 'date' })
  fecha: Date;

  @Column()
  horaInicio: string; // Por ejemplo: '08:00'

  @Column()
  horaFin: string;   // Por ejemplo: '09:00'

  @Column({
    type: 'enum',
    enum: EstadoDisponibilidad,
    default: EstadoDisponibilidad.Libre,
  })
  estado: EstadoDisponibilidad;
}
