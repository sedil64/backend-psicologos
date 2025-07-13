import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Paciente } from './paciente.entity';
import { Repository } from 'typeorm';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { Usuario } from '../usuarios/usuarios.entity';

@Injectable()
export class PacientesService {
  constructor(
    @InjectRepository(Paciente)
    private readonly repo: Repository<Paciente>,
  ) {}

  async create(dto: CreatePacienteDto, usuario: Usuario): Promise<Paciente> {
    const nuevo = this.repo.create({ ...dto, usuario });
    return this.repo.save(nuevo);
  }

  async findAll(): Promise<Paciente[]> {
    return this.repo.find({ relations: ['usuario'] });
  }

  async findById(id: number): Promise<Paciente> {
    return this.repo.findOne({ where: { id }, relations: ['usuario'] });
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
