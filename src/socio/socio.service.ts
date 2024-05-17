/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SocioEntity } from './socio.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class SocioService {

    //Constructor

    constructor(
        @InjectRepository(SocioEntity)
        private readonly socioRepository: Repository<SocioEntity>
    ){}


    //Create
    async create(socio: SocioEntity): Promise<SocioEntity>{

        if(!socio.correo.includes('@'))
            throw new BusinessLogicException("The correo is not accepted", BusinessError.PRECONDITION_FAILED)

        return await this.socioRepository.save(socio)
    }

    //Update
    async update(socioId: string, socio: SocioEntity): Promise<SocioEntity>{

        if(!socio.correo.includes('@'))
            throw new BusinessLogicException("The correo is not accepted", BusinessError.PRECONDITION_FAILED)

        const socioPersisted: SocioEntity = await this.socioRepository.findOne({where: {id: socioId}})

        if(!socioPersisted)
            throw new BusinessLogicException("The socio with the given id was not found", BusinessError.NOT_FOUND)

        return await this.socioRepository.save({...socioPersisted, ...socio})
    }

    //Delete
    async delete(socioId: string){

        const socio: SocioEntity = await this.socioRepository.findOne({where: {id: socioId}})

        if(!socio)
            throw new BusinessLogicException("The socio with the given id was not found", BusinessError.NOT_FOUND)

        await this.socioRepository.remove(socio)
    }

    //FindAll
    async findAll(): Promise<SocioEntity[]>{

        return await this.socioRepository.find({relations: ["clubes"]})

    }

    //FindOne
    async findOne(socioId: string): Promise<SocioEntity>{

        const socio: SocioEntity = await this.socioRepository.findOne({where: {id: socioId}, relations: ["clubes"]})

        if(!socio)
            throw new BusinessLogicException("The socio with the given id was not found", BusinessError.NOT_FOUND)

        return socio

    }

}
