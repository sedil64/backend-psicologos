import { SetMetadata } from '@nestjs/common';

/**
 * Decorador para marcar rutas públicas (sin requerir JWT)
 */
export const Public = () => SetMetadata('isPublic', true);
