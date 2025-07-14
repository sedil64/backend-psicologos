import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Cita, EstadoCita } from './entities/citas.entity';
import { CreateCitaDto } from './dto/create-cita.dto';
import { PsicologosService } from '../psicologos/psicologos.service';
import { PacientesService } from '../pacientes/pacientes.service';

@Injectable()
export class CitasService {
  constructor(
    @InjectRepository(Cita)
    private readonly citaRepo: Repository<Cita>,

    private readonly psicologosService: PsicologosService,
    private readonly pacientesService: PacientesService,
  ) {}

  async create(dto: CreateCitaDto): Promise<Cita> {
    const psicologo = await this.psicologosService.findById(dto.psicologoId);
    const paciente  = await this.pacientesService.findById(dto.pacienteId);

    const nueva = this.citaRepo.create({
      nombreCliente: dto.nombreCliente,
      fecha:         dto.fecha,
      hora:          dto.hora,
      psicologo,
      paciente,
    });

    return this.citaRepo.save(nueva);
  }

  async findAll(): Promise<Cita[]> {
    return this.citaRepo.find();  // eager carga psicologo y paciente
  }

  async findOne(id: number): Promise<Cita> {
    const cita = await this.citaRepo.findOne({ where: { id } });
    if (!cita) throw new NotFoundException(`Cita ${id} no encontrada`);
    return cita;
  }

  async confirmar(id: number): Promise<Cita> {
    const cita = await this.findOne(id);
    cita.estado = EstadoCita.Confirmada;
    return this.citaRepo.save(cita);
  }

  async cancelar(id: number): Promise<Cita> {
    const cita = await this.findOne(id);
    cita.estado = EstadoCita.Cancelada;
    return this.citaRepo.save(cita);
  }

  async remove(id: number): Promise<void> {
    await this.citaRepo.delete(id);
  }
}
