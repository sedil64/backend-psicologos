import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Account } from '../auth/entities/account.entity';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account]),
    AuthModule,
  ],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
