import { IsArray, IsOptional, IsString } from 'class-validator';

export class ProfileUpdateDto {
  @IsString()
  name: string;

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

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  headline?: string;
}
