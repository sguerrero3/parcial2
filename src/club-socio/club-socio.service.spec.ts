/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { ClubSocioService } from './club-socio.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { SocioEntity } from '../socio/socio.entity';
import { ClubEntity } from '../club/club.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('ClubSocioService', () => {
  let service: ClubSocioService;
  let socioRepository: Repository<SocioEntity>;
  let clubRepository: Repository<ClubEntity>;
  let club: ClubEntity;
  let socioList: SocioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClubSocioService],
    }).compile();

    service = module.get<ClubSocioService>(ClubSocioService);
    socioRepository = module.get<Repository<SocioEntity>>(getRepositoryToken(SocioEntity))
    clubRepository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity))

    await seedDatabase()

  });

  const seedDatabase = async () => {
    clubRepository.clear();
    socioRepository.clear();

    socioList = [];
    for(let i = 0; i < 5; i++){
        const comentario: SocioEntity = await socioRepository.save({
          nombre: faker.company.name(),
          correo: faker.internet.email(),
          fechaNacimineto: faker.date.past({years: 1})
        })
        socioList.push(comentario);
    }

    club = await clubRepository.save({
      nombre: faker.company.name(),
      fechaFundacion: faker.date.past({years: 1}),
      imagen: faker.internet.url(),
      descripcion: faker.lorem.sentence({ min: 1, max: 2 }),
      socios: socioList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //Prueba addMemberToClub
  it('addMemberToClub should add an socio to a club', async () =>{

    const newSocio: SocioEntity = await socioRepository.save({
      nombre: faker.company.name(),
      correo: faker.internet.email(),
      fechaNacimineto: faker.date.past({years: 1})
    })

    const newClub: ClubEntity = await clubRepository.save({
      nombre: faker.company.name(),
      fechaFundacion: faker.date.past({years: 1}),
      imagen: faker.internet.url(),
      descripcion: faker.lorem.sentence({ min: 1, max: 2 })
    })

    const result: ClubEntity = await service.addMemberToClub(newClub.id, newSocio.id)

    expect(result.socios.length).toBe(1)
    expect(result.socios[0]).not.toBeNull()
    expect(result.socios[0].nombre).toBe(newSocio.nombre)
    expect(result.socios[0].correo).toBe(newSocio.correo)
    expect(result.socios[0].fechaNacimineto).toEqual(newSocio.fechaNacimineto)

  })

  //Prueba addMemberToClub club invalido
  it('addMemberToClub should throw an exception for invalid club', async () => {
    
    const newSocio: SocioEntity = await socioRepository.save({
      nombre: faker.company.name(),
      correo: faker.internet.email(),
      fechaNacimineto: faker.date.past({years: 1})
    })

    await expect(() => service.addMemberToClub("0", newSocio.id)).rejects.toHaveProperty("message", "The club with the given id was not found")

  })

  //Prueba addMemberToClub socio invalido 

  it('addMemberToClub should throw an exception for invalid socio', async () => {

    const newClub: ClubEntity = await clubRepository.save({
      nombre: faker.company.name(),
      fechaFundacion: faker.date.past({years: 1}),
      imagen: faker.internet.url(),
      descripcion: faker.lorem.sentence({ min: 1, max: 2 })
    })

    await expect(() => service.addMemberToClub(newClub.id, "0")).rejects.toHaveProperty("message", "The socio with the given id was not found")

  })


  //Prueba findMemberFromClub
  it('findMemberFromClub should return a socio', async () => {

    const socio: SocioEntity = socioList[0]
    const storedAereopuerto: SocioEntity = await service.findMemberFromClub(club.id, socio.id)

    expect(storedAereopuerto).not.toBeNull()
    expect(storedAereopuerto.nombre).toBe(socio.nombre)
    expect(storedAereopuerto.correo).toBe(socio.correo)
    expect(storedAereopuerto.fechaNacimineto).toEqual(socio.fechaNacimineto)
  })

  //Prueba findMemberFromClub club invalido
  it('findMemberFromClub shoud throw an exception for invalid club', async () =>{
    const socio: SocioEntity = socioList[0]
    await expect(() => service.findMemberFromClub("0", socio.id)).rejects.toHaveProperty("message", "The club with the given id was not found")
  })

  //Prueba findMemberFromClub socio invalido
  it('findMemberFromClub shoud throw an exception for invalid socio', async () => {

    await expect(()=> service.findMemberFromClub(club.id, "0")).rejects.toHaveProperty("message", "The socio with the given id was not found")
  })

  //Prueba findMemberFromClub socio no asociado a club
  it('findMemberFromClub shoud throw an exception for socio not associated to club', async () => {

    const newSocio: SocioEntity = await socioRepository.save({
      nombre: faker.company.name(),
      correo: faker.internet.email(),
      fechaNacimineto: faker.date.past({years: 1})
    })

    await expect(() => service.findMemberFromClub(club.id, newSocio.id)).rejects.toHaveProperty("message", "The socio with the given id is not associated to the club")

  })


  //Prueba findMembersFromClub
  it("findMembersFromClub should return comentarios by club", async () => {

    const socios: SocioEntity[] = await service.findMembersFromClub(club.id)

    expect(socios).not.toBeNull()
    expect(socios.length).toBe(socioList.length)

  })

  //Prueba findMembersFromClub con club invalido
  it("findMembersFromClub should throw an exception for invalid club", async () => {

    await expect(()=> service.findMembersFromClub("0")).rejects.toHaveProperty("message", "The club with the given id was not found")

  })

  //Prueba updateMembersFromClub 
  it("updateMembersFromClub should update comentario list for a club", async () => {
    
    const newSocio: SocioEntity = await socioRepository.save({
      nombre: faker.company.name(),
      correo: faker.internet.email(),
      fechaNacimineto: faker.date.past({years: 1})
    })

    const updatedAereolinea: ClubEntity = await service.updateMembersFromClub(club.id, [newSocio])

    expect(updatedAereolinea.socios.length).toBe(1)
    expect(updatedAereolinea.socios[0]).not.toBeNull()
    expect(updatedAereolinea.socios[0].nombre).toBe(newSocio.nombre)
    expect(updatedAereolinea.socios[0].correo).toBe(newSocio.correo)
    expect(updatedAereolinea.socios[0].fechaNacimineto).toEqual(newSocio.fechaNacimineto)
  })

  //Prueba updateMembersFromClub invalid club
  it('updateMembersFromClub should throw an exception for invalid club', async () => {

    const newSocio: SocioEntity = await socioRepository.save({
      nombre: faker.company.name(),
      correo: faker.internet.email(),
      fechaNacimineto: faker.date.past({years: 1})
    })

    await expect(() => service.updateMembersFromClub("0", [newSocio])).rejects.toHaveProperty("message", "The club with the given id was not found")

  })


  //Prueba updateMembersFromClub invalid socio
  it('updateMembersFromClub should throw an exception for invalid socio', async () => {

    const newSocio: SocioEntity = socioList[0]
    newSocio.id = "0"

    await expect(() => service.updateMembersFromClub(club.id, [newSocio])).rejects.toHaveProperty("message", "The socio with the given id was not found")
    
  })

  //Prueba deleteMemberFromClub
  it("deleteMemberFromClub shuold remove socio form a club", async () => {

    const socio: SocioEntity = socioList[0]

    await service.deleteMemberFromClub(club.id, socio.id)
    const storedAereolinea: ClubEntity = await clubRepository.findOne({where: {id: club.id}, relations: ["socios"]});

   const deletedAereopuerto: SocioEntity = storedAereolinea.socios.find(a => a.id === socio.id);

   expect(deletedAereopuerto).toBeUndefined();

  })

  //Preuba deleteMemberFromClub invalid club
  it("deleteComentarioTorneo should throw an exception for invalid club", async () => {

    const comentario:SocioEntity = socioList[0]

    await expect(() => service.deleteMemberFromClub("0", comentario.id)).rejects.toHaveProperty("message", "The club with the given id was not found")


  })

  //Prueba deleteMemberFromClub invalid socio
  it("deleteMemberFromClub should throw an exception for invalid socio", async () => {

    await expect(() => service.deleteMemberFromClub(club.id, "0")).rejects.toHaveProperty("message", "The socio with the given id was not found")
    
  })

  //Prueba deleteMemberFromClub socio no asociado a torneo
  it("deleteComentarioTorneo should throw an exception for socio not associated to torneo", async () => {

    const newSocio: SocioEntity = await socioRepository.save({
      nombre: faker.company.name(),
      correo: faker.internet.email(),
      fechaNacimineto: faker.date.past({years: 1})
    })
    
    await expect(() => service.deleteMemberFromClub(club.id, newSocio.id)).rejects.toHaveProperty("message", "The socio with the given id is not associated to the club")

  })
});
