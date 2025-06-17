import { IsString, Length, Matches } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';

export class CreateBadgeDto {
  @IsString()
  @Length(2, 40)
  @Matches(/^\S.*\S$/, {
    message: 'Name must not be just whitespace',
  })
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsString()
  @Length(2, 100)
  @Matches(/^\S.*\S$/, {
    message: 'Name must not be just whitespace',
  })
  @Transform(({ value }) => value?.trim())
  description: string;
}

export class UpdateBadgeDto extends PartialType(CreateBadgeDto) {}
