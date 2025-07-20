// src/disponibilidad/disponibilidad.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';

import { Disponibilidad, EstadoDisponibilidad } from './entity/disponibilidad.entity';
import { CrearDisponibilidadDto } from './dto/crear-disponibilidad.dto';
import { Psicologo } from '../psicologos/entities/psicologos.entity';

@Injectable()
export class DisponibilidadService {
  constructor(
    @InjectRepository(Disponibilidad)
    private readonly repo: Repository<Disponibilidad>,
  ) {}

  /**
   * Lista todas las disponibilidades libres para los pacientes (público).
   */
  async getDisponibilidadesLibresParaPaciente(): Promise<Disponibilidad[]> {
    return this.repo.find({
      where: {
        estado: EstadoDisponibilidad.Libre,
        fecha: MoreThanOrEqual(new Date()),
      },
      relations: ['psicologo'],
      order: { fecha: 'ASC', horaInicio: 'ASC' },
    });
  }

  /**
   * Crea una nueva disponibilidad para un psicólogo autenticado.
   */
  async crearDisponibilidad(
    psicologoId: number,
    dto: CrearDisponibilidadDto,
  ): Promise<Disponibilidad> {
    const disponibilidad = this.repo.create({
      fecha: dto.fecha,
      horaInicio: dto.horaInicio,
      horaFin: dto.horaFin,
      estado: EstadoDisponibilidad.Libre,
      psicologo: { id: psicologoId } as Psicologo,
    });

    return this.repo.save(disponibilidad);
  }

  /**
   * Devuelve todas las disponibilidades creadas por el psicólogo.
   */
  async getDisponibilidadesPorPsicologo(psicologoId: number): Promise<Disponibilidad[]> {
    return this.repo.find({
      where: {
        psicologo: { id: psicologoId },
      },
      order: { fecha: 'DESC', horaInicio: 'ASC' },
    });
  }
}
