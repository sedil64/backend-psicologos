import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Cita, EstadoCita } from './entities/citas.entity';
import { CreateCitaDto } from './dto/create-cita.dto';
import { PsicologosService } from '../psicologos/psicologos.service';
import { PacientesService } from '../pacientes/pacientes.service';

import { Disponibilidad, EstadoDisponibilidad } from '../disponibilidad/entity/disponibilidad.entity';
import { InjectRepository as InjectRepositoryDisponibilidad } from '@nestjs/typeorm';

@Injectable()
export class CitasService {
  constructor(
    @InjectRepository(Cita)
    private readonly citaRepo: Repository<Cita>,

    @InjectRepositoryDisponibilidad(Disponibilidad)
    private readonly disponibilidadRepo: Repository<Disponibilidad>,

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

  /**
   * Nuevo método: agenda una cita a partir de una disponibilidad,
   * sólo si está libre, y actualiza la disponibilidad a reservada.
   * @param pacienteId id del paciente que agenda
   * @param disponibilidadId id de la disponibilidad seleccionada
   * @param nombreCliente nombre para la cita
   */
  async agendarDesdeDisponibilidad(
    pacienteId: number,
    disponibilidadId: number,
    nombreCliente: string,
  ): Promise<Cita> {
    // Buscar disponibilidad
    const disponibilidad = await this.disponibilidadRepo.findOne({
      where: { id: disponibilidadId },
      relations: ['psicologo'],
    });
    if (!disponibilidad)
      throw new NotFoundException(`Disponibilidad ${disponibilidadId} no encontrada`);

    if (disponibilidad.estado !== EstadoDisponibilidad.Libre)
      throw new BadRequestException(`Disponibilidad no está libre`);

    // Buscar paciente
    const paciente = await this.pacientesService.findById(pacienteId);
    if (!paciente)
      throw new NotFoundException(`Paciente ${pacienteId} no encontrado`);

    // Crear la cita con los datos de la disponibilidad y paciente
    const cita = this.citaRepo.create({
      nombreCliente,
      fecha: disponibilidad.fecha,
      hora: disponibilidad.horaInicio,
      psicologo: disponibilidad.psicologo,
      paciente,
      estado: EstadoCita.Pendiente,
    });

    // Guardar cita
    const citaGuardada = await this.citaRepo.save(cita);

    // Actualizar disponibilidad a reservada
    disponibilidad.estado = EstadoDisponibilidad.Reservada;
    await this.disponibilidadRepo.save(disponibilidad);

    return citaGuardada;
  }
}
