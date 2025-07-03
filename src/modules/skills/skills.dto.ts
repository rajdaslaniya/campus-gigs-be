import { IsNotEmpty, IsOptional, IsInt } from 'class-validator';

export class SkillDto {
  @IsNotEmpty()
  name: string;
}
