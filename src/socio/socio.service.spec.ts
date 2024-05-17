/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { SocioService } from './socio.service';
import { Repository } from 'typeorm';
import { SocioEntity } from './socio.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('SocioService', () => {
  let service: SocioService;
  let repository: Repository<SocioEntity>;
  let socioList: SocioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SocioService],
    }).compile();

    service = module.get<SocioService>(SocioService);
    repository = module.get<Repository<SocioEntity>>(getRepositoryToken(SocioEntity))

    await seedDatabase();
  });

//Poblar base de datos para pruebas
const seedDatabase = async () => {
  repository.clear();
  socioList = [];
    for(let i = 0; i < 5; i++){
        const socio: SocioEntity = await repository.save({
          nombre: faker.company.name(),
          correo: faker.internet.email(),
          fechaNacimineto: faker.date.past({years: 1})
        })
        
        socioList.push(socio);
    }
}

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

   //Prueba Create socio
 it('create should return a new socio', async () => {

  const socio: SocioEntity = {
    id: '',
    nombre: faker.company.name(),
    correo: faker.internet.email(),
    fechaNacimineto: faker.date.past({years: 1}),
    clubes: []
  }

  const newClub: SocioEntity = await service.create(socio);

  expect(newClub).not.toBeNull();

  const storedSocio: SocioEntity = await repository.findOne({where: {id: newClub.id}})
  expect(storedSocio).not.toBeNull();
  expect(storedSocio.nombre).toEqual(newClub.nombre)
  expect(storedSocio.correo).toEqual(newClub.correo)
  expect(storedSocio.fechaNacimineto).toEqual(newClub.fechaNacimineto)

 });

 //Prueba Delete socio
 it('delete should remove a socio', async ()=> {
  const socio: SocioEntity = socioList[0];
  await service.delete(socio.id);
  const deletedSocio: SocioEntity = await repository.findOne({ where: { id: socio.id } })

  expect(deletedSocio).toBeNull();

 })


 //Prueba Delete socio que no existe

 it('delete should throw an exception for an invalid socio', async () => {

  await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The socio with the given id was not found");

 })


 //Prueba Update socio

 it('update should return a updated socio', async () => {

  const socio: SocioEntity = socioList[0];
  socio.nombre = "Nuevo nombre"
  socio.correo = "Nuevocorreo@gmail.com";
  socio.fechaNacimineto = new Date('2002-05-14');
  
  const updatedClub: SocioEntity = await service.update(socio.id, socio);
  expect(updatedClub).not.toBeNull();
  
  const storedSocio: SocioEntity = await repository.findOne({where: {id: socio.id}})
  expect(storedSocio).not.toBeNull();  
  expect(storedSocio.nombre).toEqual(socio.nombre)
  expect(storedSocio.correo).toEqual(socio.correo)
  expect(storedSocio.fechaNacimineto).toEqual(socio.fechaNacimineto)  
 
})

 //Prueba Update socio que no existe
 it('update should throw an exception for an invalid socio', async ()=> {
  const socio: SocioEntity = socioList[0];
  socio.nombre = "Nuevo nombre"
  socio.correo = "Nuevocorreo@gmail.com";
  socio.fechaNacimineto = new Date('2002-05-14');
  

  await expect(() => service.update("0", socio)).rejects.toHaveProperty("message", "The socio with the given id was not found")
 })

 //Prueba Find all socio

 it('findall should return all socio', async () => {
  const socios: SocioEntity[] = await service.findAll()
  expect(socios).not.toBeNull();
  expect(socios).toHaveLength(socioList.length);
 })

 //Prueba Find one socio

 it('findone should return a socio by id', async () => {
  const socio: SocioEntity = socioList[0];
  const storedSocio: SocioEntity = await service.findOne(socio.id) ;
  expect(storedSocio).not.toBeNull();  
  expect(storedSocio.nombre).toEqual(socio.nombre)
  expect(storedSocio.correo).toEqual(socio.correo)
  expect(storedSocio.fechaNacimineto).toEqual(socio.fechaNacimineto)  

 })

 //Prueba Finf one socio que no existe

 it('findone should throw an exception for an invalid socio', async () =>{

  await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The socio with the given id was not found")
 })


 //Prueba create invalid correo
 it('Create should throw an exception for invalid correo', async () =>{

  const socio: SocioEntity = {
    id: '',
    nombre: faker.company.name(),
    correo: "No soy un correo",
    fechaNacimineto: faker.date.past({years: 1}),
    clubes: []
  }

  await expect(() => service.create(socio)).rejects.toHaveProperty("message", "The correo is not accepted")

 })


  //Prueba update invalid correo
 it('Update should throw an exception for invalid correo', async () => {
  const socio: SocioEntity = socioList[0];
  socio.nombre = "Nuevo nombre"
  socio.correo = "No soy un correo";
  socio.fechaNacimineto = new Date('2002-05-14');
  

  await expect(() => service.update(socio.id, socio)).rejects.toHaveProperty('message', "The correo is not accepted");
 })
});
