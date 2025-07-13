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
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RequestWithUser } from '../common/interfaces/request-with-user.interface';

@Controller('psicologos')
export class PsicologosController {
  constructor(private readonly service: PsicologosService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async create(
    @Body() dto: CreatePsicologoDto,
    @Req() req: RequestWithUser,
  ): Promise<any> {
    const usuario = req.user;

    // 🧠 Log para ver qué usuario accede a la creación
    console.log('🧑‍⚕️ Usuario en psicologos.controller.ts:', usuario);

    return this.service.create(dto, usuario);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: number) {
    return this.service.findById(id);
  }

  @Get('perfil/:id')
  @UseGuards(JwtAuthGuard)
  async getPerfil(@Param('id') id: number) {
    return this.service.getPerfilCompleto(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async remove(@Param('id') id: number) {
    return this.service.delete(id);
  }
}
