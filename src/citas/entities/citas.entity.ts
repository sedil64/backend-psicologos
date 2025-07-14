import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Psicologo } from '../../psicologos/entities/psicologos.entity';

export type EstadoCita = 'pendiente' | 'confirmada' | 'cancelada';

@Entity('citas')
export class Cita {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombreCliente: string;

  @Column({ type: 'date' })
  fecha: string;

  // ← nuevo campo hora (tipo SQL TIME, guardado como string "HH:MM:SS")
  @Column({ type: 'time' })
  hora: string;

  @Column({
    type: 'enum',
    enum: ['pendiente', 'confirmada', 'cancelada'],
    default: 'pendiente',
  })
  estado: EstadoCita;

  @ManyToOne(() => Psicologo, psicologo => psicologo.citas, { eager: true })
  @JoinColumn()
  psicologo: Psicologo;
}
