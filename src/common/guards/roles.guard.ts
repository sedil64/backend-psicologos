import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Logs para depuración
    console.log('🛡️ Roles requeridos para la ruta:', requiredRoles);
    console.log('🔎 Usuario autenticado:', user);
    console.log('🔍 Rol en req.user:', user?.rol);

    if (!requiredRoles) {
      console.log('✅ No se requieren roles. Permiso concedido.');
      return true;
    }

    const tienePermiso = requiredRoles.includes(user?.rol);
    console.log(`🔐 ¿Rol permitido? ${tienePermiso ? 'Sí' : 'No'}`);

    return tienePermiso;
  }
}
