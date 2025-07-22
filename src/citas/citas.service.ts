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
    console.log('🟡 Entrando al método create() con DTO:', dto);

    const psicologo = await this.psicologosService.findById(dto.psicologoId);
    console.log('🔵 Psicólogo encontrado:', psicologo);

    const paciente  = await this.pacientesService.findById(dto.pacienteId);
    console.log('🟢 Paciente encontrado:', paciente);

    const nueva = this.citaRepo.create({
      nombreCliente: dto.nombreCliente,
      fecha:         dto.fecha,
      hora:          dto.hora,
      psicologo,
      paciente,
    });

    const guardada = await this.citaRepo.save(nueva);
    console.log('✅ Cita guardada:', guardada);

    return guardada;
  }

  async findAll(): Promise<Cita[]> {
    return this.citaRepo.find();
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

  async agendarDesdeDisponibilidad(
    pacienteId: number,
    disponibilidadId: number,
    nombreCliente: string,
  ): Promise<Cita> {
    const disponibilidad = await this.disponibilidadRepo.findOne({
      where: { id: disponibilidadId },
      relations: ['psicologo'],
    });
    if (!disponibilidad)
      throw new NotFoundException(`Disponibilidad ${disponibilidadId} no encontrada`);

    if (disponibilidad.estado !== EstadoDisponibilidad.Libre)
      throw new BadRequestException(`Disponibilidad no está libre`);

    const paciente = await this.pacientesService.findById(pacienteId);
    if (!paciente)
      throw new NotFoundException(`Paciente ${pacienteId} no encontrado`);

    const cita = this.citaRepo.create({
      nombreCliente,
      fecha: disponibilidad.fecha,
      hora: disponibilidad.horaInicio,
      psicologo: disponibilidad.psicologo,
      paciente,
      estado: EstadoCita.Pendiente,
    });

    const citaGuardada = await this.citaRepo.save(cita);

    disponibilidad.estado = EstadoDisponibilidad.Reservada;
    await this.disponibilidadRepo.save(disponibilidad);

    return citaGuardada;
  }
}
