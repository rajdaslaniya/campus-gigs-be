import { IsEmail, IsString, MinLength } from 'class-validator';

export class AuthDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}

export class ResetPasswordDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  otp: string;

  @IsString()
  @MinLength(8)
  password: string;
}
