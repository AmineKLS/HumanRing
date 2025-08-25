import { IsEmail, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';


export class CreateUserDto {
@IsUUID()
uuid: string;


@IsEmail()
email: string;


@IsOptional()
@IsString()
@MaxLength(120)
displayName: string;
}