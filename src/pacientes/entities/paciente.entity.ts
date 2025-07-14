// src/pacientes/entities/paciente.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Account } from '../../auth/entities/account.entity';
import { Genero } from '../../common/enums/genero.enum';
import { Cita } from '../../citas/entities/citas.entity';

@Entity('pacientes')
export class Paciente {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Account, { cascade: true, eager: true })
  @JoinColumn()
  account: Account;

  @Column()
  nombres: string;

  @Column()
  apellidos: string;

  @Column({ unique: true })
  identificacion: string;

  @Column({ type: 'date' })
  fechaNacimiento: Date;

  @Column({ type: 'enum', enum: Genero, nullable: true })
  genero?: Genero;

  @Column()
  telefono: string;

  @Column({ nullable: true })
  telefonoEmergencia?: string;

  @Column()
  correoElectronico: string;

  @Column({ nullable: true })
  direccion?: string;

  @Column()
  edad: number;

  @Column({ nullable: true })
  antecedentesClinicos?: string;

  @OneToMany(() => Cita, cita => cita.paciente)
  citas: Cita[];
}
