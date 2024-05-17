/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { ClubService } from './club.service';
import { ClubEntity } from './club.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('ClubService', () => {
  let service: ClubService;
  let repository: Repository<ClubEntity>;
  let clubList: ClubEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClubService],
    }).compile();

    service = module.get<ClubService>(ClubService);
    repository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity))

    await seedDatabase();
  });

//Poblar base de datos para pruebas
const seedDatabase = async () => {
  repository.clear();
  clubList = [];
    for(let i = 0; i < 5; i++){
        const club: ClubEntity = await repository.save({
          nombre: faker.company.name(),
          fechaFundacion: faker.date.past({years: 1}),
          imagen: faker.internet.url(),
          descripcion: faker.lorem.sentence({min:10, max:70})
        })
        
        clubList.push(club);
    }
}

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  //Prueba Create club
 it('create should return a new club', async () => {

  const club: ClubEntity = {
    id: '',
    nombre: faker.company.name(),
    fechaFundacion: faker.date.past({years: 1}),
    imagen: faker.internet.url(),
    descripcion: faker.lorem.sentence({min:10, max:70}),
    socios: []
  }

  const newClub: ClubEntity = await service.create(club);

  expect(newClub).not.toBeNull();

  const storedClub: ClubEntity = await repository.findOne({where: {id: newClub.id}})
  expect(storedClub).not.toBeNull();
  expect(storedClub.nombre).toEqual(newClub.nombre)
  expect(storedClub.fechaFundacion).toEqual(newClub.fechaFundacion)
  expect(storedClub.imagen).toEqual(newClub.imagen)
  expect(storedClub.descripcion).toEqual(newClub.descripcion)
 });

 //Prueba Delete club
 it('delete should remove a club', async ()=> {
  const club: ClubEntity = clubList[0];
  await service.delete(club.id);
  const deletedClub: ClubEntity = await repository.findOne({ where: { id: club.id } })

  expect(deletedClub).toBeNull();

 })


 //Prueba Delete club que no existe

 it('delete should throw an exception for an invalid club', async () => {

  await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The club with the given id was not found");

 })


 //Prueba Update club

 it('update should return a updated club', async () => {

  const club: ClubEntity = clubList[0];
  club.nombre = "Nuevo nombre"
  club.fechaFundacion = new Date('2020-05-14');
  club.imagen = "www.google.com"
  club.descripcion = "Nueva descripcion"
  
  const updatedClub: ClubEntity = await service.update(club.id, club);
  expect(updatedClub).not.toBeNull();
  
  const storedClub: ClubEntity = await repository.findOne({where: {id: club.id}})
  expect(storedClub).not.toBeNull();  
  expect(storedClub.nombre).toEqual(club.nombre)
  expect(storedClub.fechaFundacion).toEqual(club.fechaFundacion)
  expect(storedClub.imagen).toEqual(club.imagen)
  expect(storedClub.descripcion).toEqual(club.descripcion)
  
 })

 //Prueba Update club que no existe
 it('update should throw an exception for an invalid club', async ()=> {
  const club: ClubEntity = clubList[0];
  club.nombre = "Nuevo nombre"
  club.fechaFundacion = new Date('2020-05-14');
  club.imagen = "www.google.com"
  club.descripcion = "Nueva descripcion"
  

  await expect(() => service.update("0", club)).rejects.toHaveProperty("message", "The club with the given id was not found")
 })

 //Prueba Find all club

 it('findall should return all club', async () => {
  const clubes: ClubEntity[] = await service.findAll()
  expect(clubes).not.toBeNull();
  expect(clubes).toHaveLength(clubList.length);
 })

 //Prueba Find one club

 it('findone should return a club by id', async () => {
  const club: ClubEntity = clubList[0];
  const storedClub: ClubEntity = await service.findOne(club.id) ;
  expect(storedClub).not.toBeNull();
  expect(storedClub.nombre).toEqual(club.nombre)
  expect(storedClub.fechaFundacion).toEqual(club.fechaFundacion)
  expect(storedClub.imagen).toEqual(club.imagen)
  expect(storedClub.descripcion).toEqual(club.descripcion)

 })

 //Prueba Finf one club que no existe

 it('findone should throw an exception for an invalid club', async () =>{

  await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The club with the given id was not found")
 })


 //Prueba create invalid descripcion
 it('Create should throw an exception for invalid descripcion', async () =>{

  const aereolinea: ClubEntity = {
    id: '',
    nombre: faker.company.name(),
    fechaFundacion: faker.date.past({years: 1}),
    imagen: faker.internet.url(),
    descripcion: faker.lorem.sentence({min:200, max:250}),
    socios: []
  }

  await expect(() => service.create(aereolinea)).rejects.toHaveProperty("message", "The descripcion is not accepted")

 })


  //Prueba update invalid descripcion
 it('Update should throw an exception for invalid descripcion', async () => {
  const club: ClubEntity = clubList[0];
  club.nombre = "Nuevo nombre"
  club.fechaFundacion = new Date('2030-05-14');
  club.imagen = "www.google.com"
  club.descripcion = faker.lorem.sentence({min:200, max:250})
  

  await expect(() => service.update(club.id, club)).rejects.toHaveProperty('message', "The descripcion is not accepted");
 })




});
