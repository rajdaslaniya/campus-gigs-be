import { IsString } from 'class-validator';

export class TireDto {
  @IsString()
  name: string;

  @IsString()
  description: string;
}
