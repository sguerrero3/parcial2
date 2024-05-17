/* eslint-disable prettier/prettier */

import { IsNotEmpty, IsString, IsUrl } from "class-validator"

export class ClubDto {

    @IsString()
    @IsNotEmpty()
    nombre: string

    @IsString()
    @IsNotEmpty()
    fechaFundacion: string

    @IsUrl()
    @IsNotEmpty()
    imagen: string

    @IsString()
    @IsNotEmpty()
    descripcion: string

}
