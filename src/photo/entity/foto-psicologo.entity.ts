// src/photo/entity/foto-psicologo.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
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
  @JoinColumn({ name: 'psicologo_id' })
  psicologo: Psicologo;
}