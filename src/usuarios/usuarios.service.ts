import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuarios.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly repo: Repository<Usuario>,
  ) {}

  async create(dto: CreateUsuarioDto): Promise<Usuario> {
    const existe = await this.repo.findOne({ where: { email: dto.email } });
    if (existe) {
      throw new BadRequestException('El correo ya está registrado');
    }

    try {
      const nuevo = this.repo.create(dto);
      const guardado = await this.repo.save(nuevo);

      if (!guardado?.id || !guardado.email || !guardado.password) {
        console.error('❌ Usuario no se guardó correctamente:', guardado);
        throw new InternalServerErrorException('Error al guardar el usuario en la base de datos');
      }

      console.log('✅ Usuario registrado exitosamente:', guardado);
      return guardado;
    } catch (error) {
      console.error('🚨 Error en UsuariosService.create:', error);
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
