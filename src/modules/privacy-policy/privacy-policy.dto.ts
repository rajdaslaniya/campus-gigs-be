import { IsString } from 'class-validator';

export class CreatePrivacyPolicyDto {
  @IsString()
  content: string;
}

export class UpdatePrivacyPolicyDto {
  @IsString()
  content: string;
} 