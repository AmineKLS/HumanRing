import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateRingDto {
  @IsNotEmpty()
  @IsEmail()
  recipientEmail: string;

  @IsNotEmpty()
  @IsString()
  message: string;
}