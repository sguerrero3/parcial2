/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ClubEntity } from '../club/club.entity';
import { SocioEntity } from '../socio/socio.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class ClubSocioService {

    //Constructor
    constructor(
        @InjectRepository(ClubEntity)
        private readonly clubRepository: Repository<ClubEntity>,

        @InjectRepository(SocioEntity)
        private readonly socioRepository: Repository<SocioEntity>

    ){}

    //addMemberToClub
    async addMemberToClub(clubId: string, socioId: string): Promise<ClubEntity>{

        const club: ClubEntity = await this.clubRepository.findOne({where:{id: clubId}, relations:["socios"]})

        if(!club)
            throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND)

        const socio: SocioEntity = await this.socioRepository.findOne({where:{id: socioId}})

        if(!socio)
            throw new BusinessLogicException("The socio with the given id was not found", BusinessError.NOT_FOUND)


        club.socios = [...club.socios, socio]

        return await this.clubRepository.save(club)
    }

    //findMembersFromClub:
    async findMembersFromClub(clubId: string): Promise<SocioEntity[]>{

        const club: ClubEntity = await this.clubRepository.findOne({where:{id: clubId}, relations:["socios"]})

        if(!club)
            throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND)

        return club.socios

    }

    //findMemberFromClub
    async findMemberFromClub(clubId: string, socioId: string): Promise<SocioEntity>{

        const club: ClubEntity = await this.clubRepository.findOne({where:{id: clubId}, relations:["socios"]})

        if(!club)
            throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND)

        const socio: SocioEntity = await this.socioRepository.findOne({where:{id: socioId}})

        if(!socio)
            throw new BusinessLogicException("The socio with the given id was not found", BusinessError.NOT_FOUND)

        const socioClub: SocioEntity = club.socios.find(e => e.id === socio.id)

        if(!socioClub)
            throw new BusinessLogicException("The socio with the given id is not associated to the club", BusinessError.PRECONDITION_FAILED)

        return socioClub
    }

    //updateMembersFromClub
    async updateMembersFromClub(clubId: string, socios: SocioEntity[]): Promise<ClubEntity>{

        const club: ClubEntity = await this.clubRepository.findOne({where: {id: clubId}, relations:["socios"]})

        if(!club)
            throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND)

        for(let i=0; i<socios.length; i++){
            const socio: SocioEntity = await this.socioRepository.findOne({where: {id: socios[i].id}})

            if(!socio)
                throw new BusinessLogicException("The socio with the given id was not found", BusinessError.NOT_FOUND)
        }

        club.socios = socios
        return await this.clubRepository.save(club)

    }
    

    //deleteMemberFromClub
    async deleteMemberFromClub(clubId: string, socioId: string){

        const club: ClubEntity = await this.clubRepository.findOne({where:{id: clubId}, relations:["socios"]})

        if(!club)
            throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND)

        const socio: SocioEntity = await this.socioRepository.findOne({where:{id: socioId}})

        if(!socio)
            throw new BusinessLogicException("The socio with the given id was not found", BusinessError.NOT_FOUND)

        const socioClub: SocioEntity = club.socios.find(e => e.id === socio.id)

        if(!socioClub)
            throw new BusinessLogicException("The socio with the given id is not associated to the club", BusinessError.PRECONDITION_FAILED)

        club.socios = club.socios.filter(e => e.id !== socio.id)
        await this.clubRepository.save(club)
    }

}
