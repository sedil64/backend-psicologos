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
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USER', 'postgres'),
        password: configService.get<string>('DB_PASS', 'admin'),
        database: configService.get<string>('DB_NAME', 'resultados_db'),
        synchronize: true, 
        ssl: { rejectUnauthorized: false },
        autoLoadEntities: true, 
      }),
    }),

    TeamsModule,
    CategoriesModule,
    PlayersModule,
  ],
})
export class AppModule {}
