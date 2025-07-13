import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Usuario } from '../usuarios/usuarios.entity';
import { Genero } from '../common/enums/genero.enum';

@Entity('pacientes')
export class Paciente {
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
  identificacion: string; // cédula, DNI, pasaporte

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
  edad: number;

  @Column({ nullable: true })
  antecedentesClinicos: string;

}
