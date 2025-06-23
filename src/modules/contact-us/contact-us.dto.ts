import { IsEmail, IsNotEmpty, IsOptional, IsString, IsIn, IsArray, ArrayNotEmpty } from 'class-validator';

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
  @IsIn(['pending', 'responded'])
  status: string;
}

export class BulkDeleteContactUsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  ids: string[];
}
