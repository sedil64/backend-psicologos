import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cita } from './citas.entity';
import { Repository } from 'typeorm';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';
import { Psicologo } from '../psicologos/psicologo.entity';

@Injectable()
export class CitasService {
  constructor(
    @InjectRepository(Cita)
    private readonly repo: Repository<Cita>,

    @InjectRepository(Psicologo)
    private readonly psicologoRepo: Repository<Psicologo>,
  ) {}

  async crear(dto: CreateCitaDto): Promise<Cita> {
    const psicologo = await this.psicologoRepo.findOne({ where: { id: dto.psicologoId } });
    if (!psicologo) throw new NotFoundException('Psicólogo no encontrado');

    const nueva = this.repo.create({
      nombreCliente: dto.nombreCliente,
      fecha: dto.fecha,
      estado: dto.estado,
      psicologo,
    });

    return this.repo.save(nueva);
  }

  async todas(): Promise<Cita[]> {
    return this.repo.find();
  }

  async porId(id: number): Promise<Cita> {
    const cita = await this.repo.findOne({ where: { id } });
    if (!cita) throw new NotFoundException('Cita no encontrada');
    return cita;
  }

  async actualizar(id: number, dto: UpdateCitaDto): Promise<Cita> {
    const cita = await this.porId(id);
    Object.assign(cita, dto);
    return this.repo.save(cita);
  }

  async eliminar(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
