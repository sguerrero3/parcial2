/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClubEntity } from './club.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class ClubService {

    //Constructor

    constructor(
        @InjectRepository(ClubEntity)
        private readonly clubRepository: Repository<ClubEntity>
    ){}


    //Create
    async create(club: ClubEntity): Promise<ClubEntity>{

        if(club.descripcion.length > 100)
            throw new BusinessLogicException("The descripcion is not accepted", BusinessError.PRECONDITION_FAILED)

        return await this.clubRepository.save(club)
    }

    //Update
    async update(clubId: string, club: ClubEntity): Promise<ClubEntity>{

        if(club.descripcion.length > 100)
            throw new BusinessLogicException("The descripcion is not accepted", BusinessError.PRECONDITION_FAILED)

        const clubPersisted: ClubEntity = await this.clubRepository.findOne({where: {id: clubId}})

        if(!clubPersisted)
            throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND)

        return await this.clubRepository.save({...clubPersisted, ...club})
    }

    //Delete
    async delete(clubId: string){

        const club: ClubEntity = await this.clubRepository.findOne({where: {id: clubId}})

        if(!club)
            throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND)

        await this.clubRepository.remove(club)
    }

    //FindAll
    async findAll(): Promise<ClubEntity[]>{

        return await this.clubRepository.find({relations: ["socios"]})

    }

    //FindOne
    async findOne(clubId: string): Promise<ClubEntity>{

        const club: ClubEntity = await this.clubRepository.findOne({where: {id: clubId}, relations: ["socios"]})

        if(!club)
            throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND)

        return club

    }
}
