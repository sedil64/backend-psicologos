import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuarios.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly repo: Repository<Usuario>,
  ) {}

  async create(dto: CreateUsuarioDto) {
    // 🔍 Verificar si ya existe el correo
    const existe = await this.repo.findOne({ where: { email: dto.email } });
    if (existe) {
      throw new BadRequestException('El correo ya está registrado');
    }

    try {
      // 🔐 Hashear contraseña
      const hash = await bcrypt.hash(dto.password, 10);

      // 🧱 Crear entidad usuario
      const nuevo = this.repo.create({ ...dto, password: hash });

      // 💾 Guardar usuario en base de datos
      const guardado = await this.repo.save(nuevo);

      if (!guardado?.id) {
        throw new InternalServerErrorException('Error al guardar el usuario');
      }

      return guardado;
    } catch (err) {
      console.error('Error en UsuariosService.create:', err);
      throw new InternalServerErrorException('No se pudo crear el usuario');
    }
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }
}
