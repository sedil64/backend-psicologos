import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Paciente } from './entities/paciente.entity';
import { Repository } from 'typeorm';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { Usuario } from '../usuarios/usuarios.entity';

@Injectable()
export class PacientesService {
  constructor(
    @InjectRepository(Paciente)
    private readonly repo: Repository<Paciente>,
  ) {}

  /**
   * 🧾 Crea un nuevo paciente vinculado a un usuario
   */
  async create(dto: CreatePacienteDto, usuario: Usuario): Promise<Paciente> {
    const nuevo = this.repo.create({ ...dto, usuario });
    return this.repo.save(nuevo);
  }

  /**
   * 🔍 Consulta todos los pacientes con sus usuarios
   */
  async findAll(): Promise<Paciente[]> {
    return this.repo.find({ relations: ['usuario'] });
  }

  /**
   * 📄 Consulta por ID, lanza error si no existe
   */
  async findById(id: number): Promise<Paciente> {
    const paciente = await this.repo.findOne({
      where: { id },
      relations: ['usuario'],
    });

    if (!paciente) {
      throw new NotFoundException(`Paciente con ID ${id} no encontrado`);
    }

    return paciente;
  }

  /**
   * 🗑️ Elimina el paciente por ID
   */
  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
