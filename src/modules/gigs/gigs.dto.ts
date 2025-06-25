import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { PAYMENT_TYPE, PROFILE_TYPE } from 'src/utils/enums';

export class PostGigsDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  image: string;

  @IsEnum(PROFILE_TYPE)
  profile_type: string;

  @IsString()
  tire: string;

  @IsString()
  gig_category: string;

  @IsDate()
  @Type(() => Date)
  start_date_time: Date;

  @IsDate()
  @Type(() => Date)
  end_date_time: Date;

  @IsEnum(PAYMENT_TYPE)
  payment_type: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  price: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  certifications: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills: string[];
}

export class PaginationParams {
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
}

export class GigsQueryParams extends PaginationParams {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  search?: string;
}
