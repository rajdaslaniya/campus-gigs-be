import { IsBoolean, IsString, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateTermsDto {
  @IsString()
  content: string;
}

export class UpdateTermsDto {
  @IsString()
  content: string;
}

export class UpdateAgreePolicy {
  @IsBoolean()
  isAgreed: boolean;
}

export class GenerateTermsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  keywords: string[];
}
