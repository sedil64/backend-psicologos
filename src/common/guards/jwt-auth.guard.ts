import { Injectable, ExecutionContext, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger('JwtAuthGuard');

  // ✅ Nest inyectará Reflector aquí sin constructor manual
  private reflector: Reflector;

  canActivate(context: ExecutionContext) {
    // 👇 Se obtiene reflector desde contexto en tiempo de ejecución
    const reflector = this.reflector ?? new Reflector();
    const isPublic = reflector.get<boolean>('isPublic', context.getHandler());

    if (isPublic) {
      this.logger.debug('🔓 Ruta pública detectada, omitiendo JWT');
      return true;
    }

    this.logger.debug('🛡️ Protegiendo ruta con JWT');
    return super.canActivate(context);
  }
}
