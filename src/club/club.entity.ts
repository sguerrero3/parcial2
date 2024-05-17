/* eslint-disable prettier/prettier */

import { SocioEntity } from "../socio/socio.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ClubEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    nombre: string

    @Column()
    fechaFundacion: string

    @Column()
    imagen: string

    @Column()
    descripcion: string

    @ManyToMany(() => SocioEntity, socio => socio.clubes)
    @JoinTable()
    socios: SocioEntity[]


}
