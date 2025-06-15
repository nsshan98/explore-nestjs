import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AuthDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
