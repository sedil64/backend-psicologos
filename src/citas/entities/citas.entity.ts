import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Psicologo } from '../../psicologos/entities/psicologos.entity';
import { Paciente }   from '../../pacientes/entities/paciente.entity';

export type EstadoCita = 'pendiente' | 'confirmada' | 'cancelada';

@Entity('citas')
export class Cita {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombreCliente: string;

  // Cambiado a Date para que TypeORM lo mapee a JS Date
  @Column({ type: 'date' })
  fecha: Date;

  // Hora como tiempo en DB, sigue siendo string en TS
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

  @ManyToOne(() => Paciente, pac => pac.citas, { eager: true })
  @JoinColumn()
  paciente: Paciente;
}
