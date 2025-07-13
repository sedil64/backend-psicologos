import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Psicologo } from './psicologo.entity';
import { Repository } from 'typeorm';
import { CreatePsicologoDto } from './dto/create-psicologo.dto';
import { Usuario } from '../usuarios/usuarios.entity';
import { CertificacionesService } from '../certificaciones/certificaciones.service'; // Mongo

@Injectable()
export class PsicologosService {
  constructor(
    @InjectRepository(Psicologo)
    private readonly repo: Repository<Psicologo>,

    private readonly certService: CertificacionesService, // MongoDB service
  ) {}

  /**
   * 🧾 Crea perfil psicólogo extendido
   */
  async create(dto: CreatePsicologoDto, usuario: Usuario): Promise<Psicologo> {
    const nuevo = this.repo.create({ ...dto, usuario });
    return this.repo.save(nuevo);
  }

  /**
   * 🔍 Retorna todos los psicólogos con su usuario
   */
  async findAll(): Promise<Psicologo[]> {
    return this.repo.find({ relations: ['usuario'] });
  }

  /**
   * 🔍 Busca por ID y retorna el psicólogo con su usuario
   */
  async findById(id: number): Promise<Psicologo> {
    return this.repo.findOne({ where: { id }, relations: ['usuario'] });
  }

  /**
   * 🧠 Retorna el perfil completo con certificaciones (MongoDB)
   */
  async getPerfilCompleto(id: number): Promise<any> {
    const psicologo = await this.findById(id);
    if (!psicologo) throw new NotFoundException('Psicólogo no encontrado');

    const mongoDoc = await this.certService.obtenerPorPsicologo(id);

    return {
      psicologo,
      certificaciones: mongoDoc?.certificaciones ?? [],
    };
  }

  /**
   * 🗑️ Elimina el psicólogo de PostgreSQL
   */
  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
