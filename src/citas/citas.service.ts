// src/citas/citas.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Cita, EstadoCita } from './entities/citas.entity';
import { CreateCitaDto } from './dto/create-cita.dto';
import { PsicologosService } from '../psicologos/psicologos.service';

@Injectable()
export class CitasService {
  constructor(
    @InjectRepository(Cita)
    private readonly citaRepo: Repository<Cita>,

    private readonly psicologosService: PsicologosService,
  ) {}

  /**
   * Crea una nueva cita vinculada a un psicólogo existente
   */
  async create(dto: CreateCitaDto): Promise<Cita> {
    // 1️⃣ Obtener psicólogo o lanzar 404
    const psicologo = await this.psicologosService.findById(dto.psicologoId);

    // 2️⃣ Crear nueva cita
    const nuevaCita = this.citaRepo.create({
      nombreCliente: dto.nombreCliente,
      fecha: dto.fecha,
      hora: dto.hora,
      psicologo,
    });

    // 3️⃣ Persistir en la base de datos
    return this.citaRepo.save(nuevaCita);
  }

  /**
   * Lista todas las citas con su psicólogo
   */
  async findAll(): Promise<Cita[]> {
    return this.citaRepo.find({ relations: ['psicologo'] });
  }

  /**
   * Consulta una cita por ID
   */
  async findOne(id: number): Promise<Cita> {
    const cita = await this.citaRepo.findOne({
      where: { id },
      relations: ['psicologo'],
    });
    if (!cita) {
      throw new NotFoundException(`Cita con ID ${id} no encontrada`);
    }
    return cita;
  }

  /**
   * Cambia el estado de la cita a 'confirmada'
   */
  async confirmar(id: number): Promise<Cita> {
    const cita = await this.findOne(id);
    cita.estado = 'confirmada';
    return this.citaRepo.save(cita);
  }

  /**
   * Cambia el estado de la cita a 'cancelada'
   */
  async cancelar(id: number): Promise<Cita> {
    const cita = await this.findOne(id);
    cita.estado = 'cancelada';
    return this.citaRepo.save(cita);
  }

  /**
   * Elimina una cita por ID
   */
  async remove(id: number): Promise<void> {
    await this.citaRepo.delete(id);
  }
}
