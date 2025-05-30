import * as crypto from 'crypto';

if (!(global as any).crypto) {
  (global as any).crypto = crypto;
}

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TeamsModule } from './teams/teams.module';
import { CategoriesModule } from './categories/categories.module';
import { PlayersModule } from './players/players.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        synchronize: true, // ⚠️ Solo para desarrollo
        ssl: {
          rejectUnauthorized: false,
        },
        autoLoadEntities: true,
      }),
    }),

    TeamsModule,
    CategoriesModule,
    PlayersModule,
  ],
})
export class AppModule {}
