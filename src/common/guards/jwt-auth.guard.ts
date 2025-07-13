import {
  Injectable,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger('JwtAuthGuard');

  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());

    if (isPublic) {
      this.logger.debug('🔓 Ruta pública detectada, omitiendo JWT');
      return true;
    }

    this.logger.debug('🛡️ Protegiendo ruta con JWT');
    return super.canActivate(context);
  }
}
