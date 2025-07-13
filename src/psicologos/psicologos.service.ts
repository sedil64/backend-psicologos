import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Psicologo } from './psicologo.entity';
import { Repository } from 'typeorm';
import { CreatePsicologoDto } from './dto/create-psicologo.dto';
import { Usuario } from '../usuarios/usuarios.entity';
import { CertificacionesService } from '../certificaciones/certificaciones.service';

@Injectable()
export class PsicologosService {
  constructor(
    @InjectRepository(Psicologo)
    private readonly repo: Repository<Psicologo>,

    private readonly certService: CertificacionesService,
  ) {}

  /**
   * 🧾 Crea un psicólogo vinculado a usuario
   */
  async create(dto: CreatePsicologoDto, usuario: Usuario): Promise<Psicologo> {
    const nuevo = this.repo.create({ ...dto, usuario });
    return this.repo.save(nuevo);
  }

  /**
   * 🔍 Lista todos los psicólogos
   */
  async findAll(): Promise<Psicologo[]> {
    return this.repo.find({ relations: ['usuario'] });
  }

  /**
   * 📄 Consulta por ID con validación
   */
  async findById(id: number): Promise<Psicologo> {
    const psicologo = await this.repo.findOne({ where: { id }, relations: ['usuario'] });
    if (!psicologo) {
      throw new NotFoundException(`Psicólogo con ID ${id} no encontrado`);
    }
    return psicologo;
  }

  /**
   * 🧠 Perfil combinado con certificaciones (MongoDB)
   */
  async getPerfilCompleto(id: number): Promise<any> {
    const psicologo = await this.findById(id);
    const mongoDoc = await this.certService.obtenerPorPsicologo(id);

    return {
      psicologo,
      certificaciones: mongoDoc?.certificaciones ?? [],
    };
  }

  /**
   * 🗑️ Elimina el psicólogo
   */
  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
