/* eslint-disable prettier/prettier */

import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SocioDto {

    @IsString()
    @IsNotEmpty()
    nombre: string

    @IsEmail()
    @IsNotEmpty()
    correo: string

    @IsString()
    @IsNotEmpty()
    fechaNacimineto: string
    
}
