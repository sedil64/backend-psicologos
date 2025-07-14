// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Account } from './entities/account.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<Account> {
    const hash = await bcrypt.hash(dto.password, 10);
    const account = this.accountRepo.create({
      email: dto.email,
      password: hash,
      role: dto.role,      // ahora recibes el role en el DTO
    });
    return this.accountRepo.save(account);
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
