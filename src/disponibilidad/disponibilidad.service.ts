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

    @InjectRepository(Psicologo)
    private readonly psicRepo: Repository<Psicologo>,
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
   * Aquí recibimos accountId, buscamos el psicólogo asociado y creamos la disponibilidad.
   */
  async crearDisponibilidad(
    accountId: number,
    dto: CrearDisponibilidadDto,
  ): Promise<Disponibilidad> {
    // Buscar perfil de psicólogo que tenga esta accountId
    const psicologo = await this.psicRepo.findOne({
      where: { account: { id: accountId } },
    });
    if (!psicologo) {
      throw new NotFoundException(
        `No existe perfil de psicólogo para cuenta ${accountId}`,
      );
    }

    // Validar que la fecha no sea pasada
    const fechaObj = new Date(dto.fecha);
    if (fechaObj < new Date()) {
      throw new NotFoundException('Fecha no puede ser anterior a hoy');
    }

    // Crear disponibilidad
    const nueva = this.repo.create({
      psicologo,
      fecha: fechaObj,
      horaInicio: dto.horaInicio,
      horaFin: dto.horaFin,
      estado: EstadoDisponibilidad.Libre,
    });

    return this.repo.save(nueva);
  }

  /**
   * Devuelve todas las disponibilidades creadas por el psicólogo.
   */
  async getDisponibilidadesPorPsicologo(
    accountId: number,
  ): Promise<Disponibilidad[]> {
    // Mapeamos accountId a psicologo.id
    const psicologo = await this.psicRepo.findOne({
      where: { account: { id: accountId } },
    });
    if (!psicologo) {
      throw new NotFoundException(
        `No existe perfil de psicólogo para cuenta ${accountId}`,
      );
    }

    return this.repo.find({
      where: { psicologo: { id: psicologo.id } },
      order: { fecha: 'DESC', horaInicio: 'ASC' },
    });
  }
}
