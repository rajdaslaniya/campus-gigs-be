import { Transform, Type } from 'class-transformer';
import { IsIn, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class GigsCategoryDto {
  @IsString()
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsNumber()
  tire_id: number;
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


export class GigsCategoryQueryParams extends PaginationParams {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  search?: string;

  @IsOptional()
  @IsString()
  @IsIn(
    [
      'name',
      'tire',
    ],
    {
      message: 'Invalid sort field',
    },
  )
  sortBy: string = 'name';

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'], {
    message: 'Sort order must be either asc or desc',
  })
  sortOrder: 'asc' | 'desc' = 'desc';
}
