// src/photo/photo.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FotoPsicologo } from './entity/foto-psicologo.entity';
import { Psicologo } from '../psicologos/entities/psicologos.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(FotoPsicologo)
    private readonly fotoRepo: Repository<FotoPsicologo>,
    @InjectRepository(Psicologo)
    private readonly psicologoRepo: Repository<Psicologo>,
  ) {}

  async uploadFotoFromAuth(filename: string, accountId: number) {
    const psicologo = await this.psicologoRepo.findOne({
      where: { account: { id: accountId } },
    });

    if (!psicologo) {
      throw new NotFoundException('Psicólogo no encontrado');
    }

    const foto = this.fotoRepo.create({
      url: `/uploads/fotos-psicologos/${filename}`,
      psicologo,
    });

    return this.fotoRepo.save(foto);
  }

  async getFotoFromAuth(accountId: number): Promise<string | null> {
    const foto = await this.fotoRepo.findOne({
      where: { psicologo: { account: { id: accountId } } },
    });

    return foto?.url ?? null;
  }
}