import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface'; // Asegúrate que exista

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger('JwtStrategy');

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    this.logger.debug('🎯 Payload recibido en JwtStrategy:', payload);

    const user = {
      id: payload.sub,
      email: payload.email,
      rol: payload.rol,
    };

    this.logger.debug('✅ Usuario construido:', user);
    return user;
  }
}
