import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../auth/entities/account.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
    private readonly authService: AuthService,
  ) {}

  // Listar todos los usuarios
  findAll(): Promise<Account[]> {
    return this.accountRepo.find();
  }

  // Obtener usuario por ID
  async findOne(id: number): Promise<Account> {
    const user = await this.accountRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`Usuario ${id} no existe`);
    return user;
  }

  // Crear usuario (reusa AuthService para hashing y validaciones)
  create(dto: CreateUserDto): Promise<Account> {
    return this.authService.register(dto);
  }

  // Actualizar sólo el role
  async updateRole(id: number, dto: UpdateUserRoleDto): Promise<Account> {
    const user = await this.findOne(id);
    user.role = dto.role;
    return this.accountRepo.save(user);
  }

  // Eliminar usuario
  remove(id: number): Promise<void> {
    return this.accountRepo.delete(id).then(() => {});
  }
}
