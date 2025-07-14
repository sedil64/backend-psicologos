// src/common/interfaces/request-with-user.interface.ts
import { Request } from 'express';
import { Account } from '../../auth/entities/account.entity';

export interface RequestWithUser extends Request {
  user: Account;
}
