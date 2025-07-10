import { Injectable, BadRequestException } from '@nestjs/common';
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
    const existe = await this.repo.findOne({ where: { email: dto.email } });
    if (existe) throw new BadRequestException('El correo ya está registrado');

    const hash = await bcrypt.hash(dto.password, 10);
    const nuevo = this.repo.create({ ...dto, password: hash });
    return this.repo.save(nuevo);
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
