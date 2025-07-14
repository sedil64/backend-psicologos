import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Psicologo } from './entities/psicologos.entity';
import { CreatePsicologoDto } from './dto/create-psicologo.dto';
import { RegisterPsicologoDto } from './dto/register-psicologo.dto';

import { Account } from '../auth/entities/account.entity';
import { AuthService } from '../auth/auth.service';
import { CertificacionesService } from '../certificaciones/certificaciones.service';

@Injectable()
export class PsicologosService {
  constructor(
    @InjectRepository(Psicologo)
    private readonly psicRepo: Repository<Psicologo>,

    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,

    private readonly authService: AuthService,
    private readonly certService: CertificacionesService,
  ) {}

  /**
   * Registro público de psicólogo: crea Account + perfil Psicologo
   */
  async register(dto: RegisterPsicologoDto): Promise<Psicologo> {
    const { email, password, role, ...profile } = dto;

    // 1️⃣ primero crear la cuenta (tabla accounts)
    const account = await this.authService.register({ email, password, role });

    // 2️⃣ luego crear perfil de psicólogo vinculado
    const psicologo = this.psicRepo.create({ account, ...profile });
    return this.psicRepo.save(psicologo);
  }

  /**
   * Creación de perfil por Admin autenticado
   */
  async create(dto: CreatePsicologoDto, account: Account): Promise<Psicologo> {
    const psicologo = this.psicRepo.create({ ...dto, account });
    return this.psicRepo.save(psicologo);
  }

  async findAll(): Promise<Psicologo[]> {
    return this.psicRepo.find({ relations: ['account'] });
  }

  async findById(id: number): Promise<Psicologo> {
    const psicologo = await this.psicRepo.findOne({
      where: { id },
      relations: ['account'],
    });
    if (!psicologo) {
      throw new NotFoundException(`Psicólogo con ID ${id} no encontrado`);
    }
    return psicologo;
  }

  async getPerfilCompleto(id: number): Promise<any> {
    const psicologo = await this.findById(id);
    const mongoDoc = await this.certService.obtenerPorPsicologo(id);

    return {
      psicologo,
      certificaciones: mongoDoc?.certificaciones ?? [],
    };
  }

  async delete(id: number): Promise<void> {
    await this.psicRepo.delete(id);
  }
}
