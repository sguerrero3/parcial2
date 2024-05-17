/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocioModule } from './socio/socio.module';
import { ClubModule } from './club/club.module';
import { ClubEntity } from './club/club.entity';
import { SocioEntity } from './socio/socio.entity';
import { ClubSocioModule } from './club-socio/club-socio.module';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'parcial2',
    entities: [SocioEntity, ClubEntity],
    dropSchema: true,
    synchronize: true,
    keepConnectionAlive: true
  }), SocioModule, ClubModule, ClubSocioModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
