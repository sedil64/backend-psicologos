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
import { Paciente } from '../../pacientes/entities/paciente.entity';
import { Disponibilidad } from '../../disponibilidad/entity/disponibilidad.entity';

export enum EstadoCita {
  Pendiente   = 'pendiente',
  Confirmada  = 'confirmada',
  Cancelada   = 'cancelada',
}

@Entity('citas')
export class Cita {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  nombreCliente: string;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ type: 'time' })
  hora: string;

  @Column({
    type: 'enum',
    enum: EstadoCita,
    default: EstadoCita.Pendiente,
  })
  estado: EstadoCita;

  @ManyToOne(() => Psicologo, p => p.citas, {
    eager: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'psicologo_id' })
  psicologo: Psicologo;

  @ManyToOne(() => Paciente, p => p.citas, {
    eager: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'paciente_id' })
  paciente: Paciente;

  @ManyToOne(() => Disponibilidad, { eager: true, nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'disponibilidad_id' })
  disponibilidad?: Disponibilidad;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
