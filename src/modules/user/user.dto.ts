import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
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

  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'You must agreed the terms and conditions' })
  isAgreed: boolean;

  @IsOptional()
  @IsString()
  professional_interests: string;

  @IsOptional()
  @IsString()
  extracurriculars: string;

  @IsOptional()
  @IsString()
  certifications: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills: string[];

  @IsOptional()
  @IsString()
  education: string;
}
