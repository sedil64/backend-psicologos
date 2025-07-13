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

  /**
   * Registra un nuevo usuario
   * - Hashea la contraseña antes de guardarla
   * - Persiste el usuario en PostgreSQL
   * - Genera y retorna un token JWT
   */
  async register(dto: RegisterDto) {
    const hash = await bcrypt.hash(dto.password, 10);

    // 🔐 Se delega el guardado con la contraseña hasheada
    const usuario = await this.usuariosService.create({
      ...dto,
      password: hash,
    });

    // ⚠️ Se puede agregar validación: if (!usuario?.id) throw new Error(...)

    const payload = {
      sub: usuario.id,
      email: usuario.email,
      role: usuario.rol,
    };

    // 🧾 Log para confirmar datos del token en consola
    console.log('✅ Registro exitoso. Payload:', payload);

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
   * Valida credenciales de usuario
   * - Busca por email
   * - Compara contraseña con bcrypt
   * - Genera token si es válido
   */
  async login(dto: LoginDto) {
    // 📨 Verifica qué DTO se recibe
    console.log('📨 DTO recibido en login:', dto);

    const user = await this.usuariosService.findByEmail(dto.email);
    console.log('🔍 Usuario encontrado en login:', user);

    // ⚠️ Se asegura que el usuario exista y la contraseña sea válida
    const isValidPassword =
      user && (await bcrypt.compare(dto.password, user.password));
    console.log('🔐 ¿Contraseña válida?', isValidPassword);

    if (!user || !isValidPassword) {
      console.error('⛔ Falla de autenticación: usuario inválido o contraseña incorrecta');
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      rol: user.rol,
    };

    console.log('🎟️ Token de login generado:', payload);

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
