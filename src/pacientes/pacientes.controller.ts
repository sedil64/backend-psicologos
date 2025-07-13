import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { PacientesService } from './pacientes.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { Usuario } from '../usuarios/usuarios.entity'; // esta referencia puede venir del auth logic

@Controller('pacientes')
export class PacientesController {
  constructor(private readonly service: PacientesService) {}

  @Post()
  async create(@Body() dto: CreatePacienteDto): Promise<any> {
    const usuario = new Usuario(); // deberías recibirlo desde AuthService
    // asignar email, password, rol, etc.
    return this.service.create(dto, usuario);
  }

  @Get()
  async all() {
    return this.service.findAll();
  }

  @Get(':id')
  async one(@Param('id') id: number) {
    return this.service.findById(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.service.delete(id);
  }
}
