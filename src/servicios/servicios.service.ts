import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Servicio } from './servicios.entity';
import { CreateServicioDto } from './dto/create-servicio.dto';

@Injectable()
export class ServiciosService {
  constructor(
    @InjectRepository(Servicio)
    private readonly repo: Repository<Servicio>,
  ) {}

  create(dto: CreateServicioDto) {
    const nuevo = this.repo.create(dto);
    return this.repo.save(nuevo);
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }
}
