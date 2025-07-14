import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

// antes tenías:
// export type Role = 'admin' | 'psicologo' | 'paciente';

export enum Role {
  ADMIN     = 'admin',
  PSICOLOGO = 'psicologo',
  PACIENTE  = 'paciente',
}

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn() id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.PACIENTE,
  })
  role: Role;

  @CreateDateColumn()
  createdAt: Date;
}
