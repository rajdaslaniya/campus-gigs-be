import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { ROLE } from 'src/utils/enums';

export class SignupDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsEnum(ROLE)
  role: string;

  @IsBoolean({ message: "You must agreed the terms and conditions"})
  isAgreed: boolean;
}
