/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ClubSocioService } from './club-socio.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocioEntity } from '../socio/socio.entity';
import { ClubEntity } from '../club/club.entity';

@Module({
    imports: [TypeOrmModule.forFeature([SocioEntity, ClubEntity])],
  providers: [ClubSocioService]
})
export class ClubSocioModule {}
