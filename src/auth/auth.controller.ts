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
    return this.authService.register(dto);
  }

  /**
   * Login de usuario - acceso público sin JWT
   */
  @Public()
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  /**
   * Diagnóstico - obtener datos del usuario autenticado
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Req() req: RequestWithUser) {
    console.log('🔍 Usuario autenticado:', req.user); // Log útil para PM2
    return req.user;
  }
}
