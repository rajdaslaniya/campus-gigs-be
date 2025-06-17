import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { ROLE } from 'src/utils/enums';

export class SignupDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsEnum(ROLE)
  role: string;
}
