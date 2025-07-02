import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class TireDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  description: string;
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


export class TireQueryParams extends PaginationParams {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  search?: string;

  @IsOptional()
  @IsString()
  @IsIn(
    [
      'name',
      'description'
    ],
    {
      message: 'Invalid sort field',
    },
  )
  sortKey: string = 'name';

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'], {
    message: 'Sort order must be either asc or desc',
  })
  sortOrder: 'asc' | 'desc' = 'desc';
}
