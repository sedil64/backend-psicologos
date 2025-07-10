import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombreCompleto: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
  type: 'enum',
  enum: ['admin', 'psychologist', 'patient'],
  })
  rol: 'admin' | 'psychologist' | 'patient';

  @Column({ default: true })
  activo: boolean;
}
