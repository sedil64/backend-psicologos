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

    console.log('🔷 Nueva cita creada en memoria (antes de guardar):', nueva);

    const guardada = await this.citaRepo.save(nueva);
    console.log('✅ Cita guardada en base de datos:', guardada);

    return guardada;
  }

  async findAll(): Promise<Cita[]> {
    console.log('🟡 findAll() llamado');
    const citas = await this.citaRepo.find();
    console.log('🔷 Citas encontradas:', citas.length);
    return citas;
  }

  async findOne(id: number): Promise<Cita> {
    console.log(`🟡 findOne() llamado con id=${id}`);
    const cita = await this.citaRepo.findOne({ where: { id } });
    if (!cita) {
      console.warn(`⚠️ Cita con id=${id} no encontrada`);
      throw new NotFoundException(`Cita ${id} no encontrada`);
    }
    console.log('🔷 Cita encontrada:', cita);
    return cita;
  }

  async confirmar(id: number): Promise<Cita> {
    console.log(`🟡 confirmar() llamado con id=${id}`);
    const cita = await this.findOne(id);
    cita.estado = EstadoCita.Confirmada;
    const guardada = await this.citaRepo.save(cita);
    console.log('✅ Cita confirmada:', guardada);
    return guardada;
  }

  async cancelar(id: number): Promise<Cita> {
    console.log(`🟡 cancelar() llamado con id=${id}`);
    const cita = await this.findOne(id);
    cita.estado = EstadoCita.Cancelada;
    const guardada = await this.citaRepo.save(cita);
    console.log('✅ Cita cancelada:', guardada);
    return guardada;
  }

  async remove(id: number): Promise<void> {
    console.log(`🟡 remove() llamado con id=${id}`);
    await this.citaRepo.delete(id);
    console.log(`✅ Cita con id=${id} eliminada`);
  }

  async agendarDesdeDisponibilidad(
    pacienteId: number,
    disponibilidadId: number,
    nombreCliente: string,
  ): Promise<Cita> {
    console.log(`🟡 agendarDesdeDisponibilidad() llamado con pacienteId=${pacienteId}, disponibilidadId=${disponibilidadId}`);

    const disponibilidad = await this.disponibilidadRepo.findOne({
      where: { id: disponibilidadId },
      relations: ['psicologo'],
    });
    if (!disponibilidad) {
      console.warn(`⚠️ Disponibilidad con id=${disponibilidadId} no encontrada`);
      throw new NotFoundException(`Disponibilidad ${disponibilidadId} no encontrada`);
    }
    console.log('🔵 Disponibilidad encontrada:', disponibilidad);

    if (disponibilidad.estado !== EstadoDisponibilidad.Libre) {
      console.warn(`⚠️ Disponibilidad con id=${disponibilidadId} no está libre (estado actual: ${disponibilidad.estado})`);
      throw new BadRequestException(`Disponibilidad no está libre`);
    }

    const paciente = await this.pacientesService.findById(pacienteId);
    if (!paciente) {
      console.warn(`⚠️ Paciente con id=${pacienteId} no encontrado`);
      throw new NotFoundException(`Paciente ${pacienteId} no encontrado`);
    }
    console.log('🟢 Paciente encontrado:', paciente);

    const cita = this.citaRepo.create({
      nombreCliente,
      fecha: disponibilidad.fecha,
      hora: disponibilidad.horaInicio,
      psicologo: disponibilidad.psicologo,
      paciente,
      estado: EstadoCita.Pendiente,
    });
    console.log('🔷 Nueva cita creada en memoria (antes de guardar):', cita);

    const citaGuardada = await this.citaRepo.save(cita);
    console.log('✅ Cita guardada en base de datos:', citaGuardada);

    disponibilidad.estado = EstadoDisponibilidad.Reservada;
    await this.disponibilidadRepo.save(disponibilidad);
    console.log(`✅ Disponibilidad con id=${disponibilidadId} marcada como Reservada`);

    return citaGuardada;
  }
}
