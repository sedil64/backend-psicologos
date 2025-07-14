import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Account } from '../../auth/entities/account.entity';
import { Genero } from '../../common/enums/genero.enum';
import { Cita } from '../../citas/entities/citas.entity';

@Entity('pacientes')
export class Paciente {
  @PrimaryGeneratedColumn()
  id: number;

  // Relación 1:1 con Account, cascade para crear la cuenta junto al perfil
  @OneToOne(() => Account, { cascade: true, eager: true })
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @Column({ length: 100 })
  nombres: string;

  @Column({ length: 100 })
  apellidos: string;

  @Column({ length: 20, unique: true })
  identificacion: string;

  @Column({ type: 'date' })
  fechaNacimiento: Date;

  @Column({ type: 'enum', enum: Genero, nullable: true })
  genero?: Genero;

  @Column({ length: 20 })
  telefono: string;

  @Column({ length: 20, nullable: true })
  telefonoEmergencia?: string;

  @Column({ length: 100 })
  correoElectronico: string;

  @Column({ nullable: true })
  direccion?: string;

  @Column('int')
  edad: number;

  @Column({ type: 'text', nullable: true })
  antecedentesClinicos?: string;

  @Column({ default: true })
  activo: boolean;

  // Relación 1:N con Cita
  @OneToMany(() => Cita, cita => cita.paciente)
  citas: Cita[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
