import { Controller, Post, Get, Delete, Param, Body } from '@nestjs/common';
import { PsicologosService } from './psicologos.service';
import { CreatePsicologoDto } from './dto/create-psicologo.dto';
import { Usuario } from '../usuarios/usuarios.entity'; // Se asigna desde AuthService en práctica real

@Controller('psicologos')
export class PsicologosController {
  constructor(private readonly service: PsicologosService) {}

  @Post()
  async create(@Body() dto: CreatePsicologoDto): Promise<any> {
    const usuario = new Usuario(); // ⚠️ A reemplazar con lógica real de AuthService
    return this.service.create(dto, usuario);
  }

  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.service.findById(id);
  }

  @Get('perfil/:id')
  async getPerfil(@Param('id') id: number) {
    return this.service.getPerfilCompleto(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.service.delete(id);
  }
}
