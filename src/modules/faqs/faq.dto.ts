import { IsString, ValidateNested, ArrayNotEmpty, IsOptional, IsIn, IsInt, Min } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateFaqDto {
  @IsString()
  @Transform(({ value }) => value?.trim())
  question: string;

  @IsString()
  @Transform(({ value }) => value?.trim())
  answer: string;
}

export class UpdateFaqDto {
  @IsString()
  @Transform(({ value }) => value?.trim())
  question: string;

  @IsString()
  @Transform(({ value }) => value?.trim())
  answer: string;
}

export class BulkCreateFaqDto {
  @ValidateNested({ each: true })
  @Type(() => CreateFaqDto)
  @ArrayNotEmpty()
  faqs: CreateFaqDto[];
}

export class FaqQueryParams {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  pageSize: number = 10;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  search?: string;

  @IsOptional()
  @IsString()
  @IsIn(['question', 'answer', 'createdAt'], { message: 'Invalid sort field' })
  sortBy: string = 'createdAt';

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'], { message: 'Sort order must be either asc or desc' })
  sortOrder: 'asc' | 'desc' = 'asc';
}
