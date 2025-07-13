import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PsicologosService } from './psicologos.service';
import { CreatePsicologoDto } from './dto/create-psicologo.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'; // ✅ importar el guard
import { Request } from 'express';
import { RequestWithUser } from '../common/interfaces/request-with-user.interface';

@UseGuards(JwtAuthGuard) // ✅ protección global para todas las rutas
@Controller('psicologos')
export class PsicologosController {
  constructor(private readonly service: PsicologosService) {}

  @Post()
  async create(@Body() dto: CreatePsicologoDto, @Req() req: RequestWithUser): Promise<any> {
    const usuario = req.user;
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
