// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Account, Role } from './entities/account.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Psicologo } from '../psicologos/entities/psicologos.entity';
import { Paciente } from '../pacientes/entities/paciente.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,

    @InjectRepository(Psicologo)
    private readonly psicologoRepo: Repository<Psicologo>,

    @InjectRepository(Paciente)
    private readonly pacienteRepo: Repository<Paciente>,

    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<Account> {
    return await this.accountRepo.manager.transaction(async (entityManager) => {
      // Validar que email no esté registrado
      const exists = await entityManager.findOne(Account, { where: { email: dto.email } });
      if (exists) {
        throw new BadRequestException('El email ya está registrado');
      }

      // Hashear password
      const hash = await bcrypt.hash(dto.password, 10);

      // Crear cuenta
      const account = entityManager.create(Account, {
        email: dto.email,
        password: hash,
        role: dto.role,
      });
      const savedAccount = await entityManager.save(account);

      // Crear perfil según rol usando el mismo entityManager (transacción)
      if (dto.role === Role.PSICOLOGO) {
        const psicologo = entityManager.create(Psicologo, {
          account: savedAccount,
          nombres: dto.nombres,
          apellidos: dto.apellidos,
          identificacion: dto.identificacion,
          fechaNacimiento: dto.fechaNacimiento,
          telefono: dto.telefono,
        });
        await entityManager.save(psicologo);
      } else if (dto.role === Role.PACIENTE) {
        const paciente = entityManager.create(Paciente, {
          account: savedAccount,
          nombres: dto.nombres,
          apellidos: dto.apellidos,
          identificacion: dto.identificacion,
          fechaNacimiento: dto.fechaNacimiento,
          telefono: dto.telefono,
        });
        await entityManager.save(paciente);
      }

      return savedAccount;
    });
  }

  async validateUser(email: string, pass: string): Promise<Account> {
    const account = await this.accountRepo.findOne({ where: { email } });
    if (!account) throw new UnauthorizedException('Credenciales inválidas');

    const isValid = await bcrypt.compare(pass, account.password);
    if (!isValid) throw new UnauthorizedException('Credenciales inválidas');

    return account;
  }

  async login(dto: LoginDto) {
    const account = await this.validateUser(dto.email, dto.password);
    const payload = { sub: account.id, email: account.email, role: account.role };
    return { access_token: this.jwtService.sign(payload) };
  }
}
