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
   * Registro de usuario - acceso público sin JWT
   */
  @Public()
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    console.log('📨 DTO recibido en register:', dto);
    return this.authService.register(dto);
  }

  /**
   * Login de usuario - acceso público sin JWT
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
   * Diagnóstico - obtener datos del usuario autenticado
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req: RequestWithUser) {
    console.log('🔍 Usuario autenticado en /auth/me:', req.user);
    return req.user;
  }
}
