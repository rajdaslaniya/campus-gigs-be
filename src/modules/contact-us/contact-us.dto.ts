import { IsEmail, IsNotEmpty, IsOptional, IsString, IsIn, IsArray, ArrayNotEmpty } from 'class-validator';
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
  @IsIn([CONTACT_US_STATUS.PENDING, CONTACT_US_STATUS.RESPONDED])
  status: string;
}

export class BulkDeleteContactUsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  ids: string[];
}
