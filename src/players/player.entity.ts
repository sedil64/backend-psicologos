import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Team } from '../teams/team.entity';

@Entity()
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('int')
  age: number;

  @Column()
  position: string;

  @ManyToOne(() => Team, (team: Team) => team.players, { eager: true })
  team: Team;
}
