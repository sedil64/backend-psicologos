import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,    // ← importa OneToMany
  JoinColumn,
} from 'typeorm';
import { Account } from '../../auth/entities/account.entity';
import { Genero } from '../../common/enums/genero.enum';
import { Cita } from '../../citas/entities/citas.entity';   // ← importa Cita

@Entity('psicologos')
export class Psicologo {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Account, { cascade: true })
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

  @Column({
    type: 'enum',
    enum: Genero,
    nullable: true,
  })
  genero: Genero;

  @Column()
  telefono: string;

  @Column({ nullable: true })
  telefonoEmergencia: string;

  @Column()
  correoElectronico: string;

  @Column({ nullable: true })
  direccion: string;

  @Column()
  licencia: string;

  @Column()
  especialidad: string;

  @Column({ nullable: true })
  universidad: string;

  @Column({ nullable: true })
  experiencia: number;

  @Column({ nullable: true })
  certificaciones: string;

  @OneToMany(() => Cita, cita => cita.psicologo, { cascade: true })
  citas: Cita[];
}
