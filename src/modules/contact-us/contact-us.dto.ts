import { IsEmail, IsNotEmpty, IsString, IsArray, ArrayNotEmpty, IsEnum, IsOptional, IsIn, IsInt, Min } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { CONTACT_US_STATUS } from '../../utils/enums';

export class CreateContactUsDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}

export class UpdateContactUsStatusDto {
  @IsEnum(CONTACT_US_STATUS)
  status: string;
}

export class BulkDeleteContactUsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  ids: string[];
}

export class ContactUsQueryParams {
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
  @IsEnum(CONTACT_US_STATUS)
  status?: string;

  @IsOptional()
  @IsString()
  @IsIn(['name', 'email', 'subject', 'status', 'createdAt'], { message: 'Invalid sort field' })
  sortBy: string = 'createdAt';

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'], { message: 'Sort order must be either asc or desc' })
  sortOrder: 'asc' | 'desc' = 'asc';
}

export class GenerateContactUsResponseDto {
  @IsString()
  subject: string;

  @IsString()
  message: string;
}
