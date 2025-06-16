import { IsEmail, IsString, MinLength } from 'class-validator';

export class UserBody {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
