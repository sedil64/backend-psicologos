import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from '../common/decorators/public.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RequestWithUser } from '../common/interfaces/request-with-user.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Registro de cuenta - crea un Account (email/password/role)
   */
  @Public()
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    console.log('📨 DTO recibido en register:', dto);
    const account = await this.authService.register(dto);
    console.log('✅ Cuenta creada:', {
      id: account.id,
      email: account.email,
      role: account.role,
      createdAt: account.createdAt,
    });
    // No devolvemos el password por seguridad
    return {
      id: account.id,
      email: account.email,
      role: account.role,
      createdAt: account.createdAt,
    };
  }

  /**
   * Login de cuenta - devuelve JWT con payload { sub, email, role }
   */
  @Public()
  @Post('login')
  async login(@Body() dto: LoginDto) {
    console.log('📨 DTO recibido en login:', dto);
    const token = await this.authService.login(dto);
    console.log('🎟️ Token generado en login:', token);
    return token;
  }

  /**
   * Obtiene datos de la cuenta autenticada
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req: RequestWithUser) {
    console.log('🔍 Usuario autenticado en /auth/me:', req.user);
    return req.user;
  }
}
