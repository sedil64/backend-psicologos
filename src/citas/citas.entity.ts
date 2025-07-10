import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Usuario } from '../usuarios/usuarios.entity';

@Entity('citas')
export class Cita {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombreCliente: string;

  @Column()
  fecha: Date;

  @Column()
  estado: 'pendiente' | 'confirmada' | 'cancelada';

  @ManyToOne(() => Usuario)
  psicologo: Usuario;
}
