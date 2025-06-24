import { IsString, ValidateNested, ArrayNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFaqDto {
  @IsString()
  question: string;

  @IsString()
  answer: string;
}

export class UpdateFaqDto {
  @IsString()
  question: string;

  @IsString()
  answer: string;
}

export class BulkCreateFaqDto {
  @ValidateNested({ each: true })
  @Type(() => CreateFaqDto)
  @ArrayNotEmpty()
  faqs: CreateFaqDto[];
}
