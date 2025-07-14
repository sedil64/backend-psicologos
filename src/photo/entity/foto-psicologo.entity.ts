import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Psicologo } from '../../psicologos/entities/psicologos.entity';

@Entity('fotos_psicologos')
export class FotoPsicologo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @ManyToOne(() => Psicologo, psicologo => psicologo.fotos, {
    onDelete: 'CASCADE',
  })
  psicologo: Psicologo;
}
