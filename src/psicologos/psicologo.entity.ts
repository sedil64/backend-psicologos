import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Usuario } from '../usuarios/usuarios.entity';

@Entity('psicologos')
export class Psicologo {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Usuario, { cascade: true })
  @JoinColumn()
  usuario: Usuario;

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
}
