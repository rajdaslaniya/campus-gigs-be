import { IsBoolean, IsString } from 'class-validator';

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
