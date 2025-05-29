import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Player } from '../players/player.entity';

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column( {nullable: true})
  name: string;

  @Column({nullable: true})
  coach: string;

  @OneToMany(() => Player, (player: Player) => player.team)
  players: Player[];
}

