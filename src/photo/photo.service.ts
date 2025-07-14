import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FotoPsicologo } from './entity/foto-psicologo.entity';
import { Psicologo } from '../psicologos/entities/psicologos.entity';

@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(FotoPsicologo)
    private readonly fotoRepo: Repository<FotoPsicologo>,
    @InjectRepository(Psicologo)
    private readonly psicologoRepo: Repository<Psicologo>,
  ) {}

  async saveFoto(filename: string, psicologoId: number) {
    const psicologo = await this.psicologoRepo.findOne({
      where: { id: psicologoId },
    });

    if (!psicologo) {
      throw new NotFoundException('Psicólogo no encontrado');
    }

    const foto = this.fotoRepo.create({
      url: `uploads/fotos-psicologos/${filename}`,
      psicologo,
    });

    return this.fotoRepo.save(foto);
  }
}
