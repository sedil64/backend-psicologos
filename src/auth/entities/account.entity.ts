import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export type Role = 'admin' | 'psicologo' | 'paciente';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn() id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: ['admin', 'psicologo', 'paciente'],
    default: 'paciente',
  })
  role: Role;

  @CreateDateColumn()
  createdAt: Date;
}
