// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';

import { Account } from './entities/account.entity';
import { Psicologo } from '../psicologos/entities/psicologos.entity';
import { Paciente } from '../pacientes/entities/paciente.entity';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret_key',
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forFeature([Account, Psicologo, Paciente]),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [
    AuthService,
    JwtStrategy,
    TypeOrmModule, // exporta los repositorios para otros módulos que lo requieran
  ],
})
export class AuthModule {}
