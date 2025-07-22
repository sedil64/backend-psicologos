// src/disponibilidad/entity/disponibilidad.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Psicologo } from '../../psicologos/entities/psicologos.entity';

export enum EstadoDisponibilidad {
  Libre = 'libre',
  Reservada = 'reservada',
  Expirada = 'expirada',
}

@Entity('disponibilidades')
export class Disponibilidad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ type: 'time' })
  horaInicio: string;

  @Column({ type: 'time' })
  horaFin: string;

  @Column({
    type: 'enum',
    enum: EstadoDisponibilidad,
    default: EstadoDisponibilidad.Libre,
  })
  estado: EstadoDisponibilidad;

  @ManyToOne(
    () => Psicologo,
    psicologo => psicologo.disponibilidades,
    { eager: true, onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'psicologo_id' })
  psicologo: Psicologo;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
