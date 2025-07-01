import { IsString, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreatePrivacyPolicyDto {
  @IsString()
  content: string;
}

export class UpdatePrivacyPolicyDto {
  @IsString()
  content: string;
}

export class GeneratePrivacyPolicyDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  keywords: string[];
} 