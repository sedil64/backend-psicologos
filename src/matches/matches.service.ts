import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from './match.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MatchesService {
  constructor(@InjectRepository(Match) private repo: Repository<Match>) {}

  create(data: Partial<Match>) {
    const match = this.repo.create(data);
    return this.repo.save(match);
  }

  findAll() {
    return this.repo.find({ relations: ['homeTeam', 'awayTeam'] });
  }
}
