import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from '../usuarios/usuarios.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usuariosService: UsuariosService,
  ) {}

  async register(dto: RegisterDto) {
    const hash = await bcrypt.hash(dto.password, 10);
    const usuario = await this.usuariosService.create({ ...dto, password: hash });

    const payload = {
      sub: usuario.id,
      email: usuario.email,
      role: usuario.rol,
    };

    console.log('✅ Registro exitoso. Payload:', payload);

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usuariosService.findByEmail(dto.email);
    console.log('🔍 Usuario encontrado en login:', user);

    const isValidPassword = user && await bcrypt.compare(dto.password, user.password);
    console.log('🔐 ¿Contraseña válida?', isValidPassword);

    if (!user || !isValidPassword) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.rol,
    };

    console.log('🎟️ Token de login generado:', payload);

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
