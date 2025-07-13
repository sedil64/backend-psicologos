import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Psicologo } from '../psicologos/psicologos.entity';

@Entity('citas')
export class Cita {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombreCliente: string;

  @Column()
  fecha: Date;

  @Column({
    type: 'enum',
    enum: ['pendiente', 'confirmada', 'cancelada'],
    default: 'pendiente',
  })
  estado: 'pendiente' | 'confirmada' | 'cancelada';

  @ManyToOne(() => Psicologo, { eager: true })
  @JoinColumn()
  psicologo: Psicologo;
}
