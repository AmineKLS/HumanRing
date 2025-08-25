import { IsOptional, IsString } from "class-validator";

export class CreateSignatureDto {
  @IsOptional()
  @IsString()
  signatureText?: String;

  @IsOptional()
  @IsString()
  audioURL?: String;

  @IsOptional()
  @IsString()
  videoURL?: String;
}