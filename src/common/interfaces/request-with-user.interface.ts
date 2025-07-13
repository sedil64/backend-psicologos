// src/common/interfaces/request-with-user.interface.ts
import { Request } from 'express';
import { Usuario } from '../../usuarios/usuarios.entity';

export interface RequestWithUser extends Request {
  user: Usuario;
}
