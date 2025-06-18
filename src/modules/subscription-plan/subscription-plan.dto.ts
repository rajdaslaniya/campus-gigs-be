import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  Validate,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

import { UserRole } from 'src/common/utils/enums';

@ValidatorConstraint({ name: 'isRequiredIfNotPro', async: false })
class IsRequiredIfNotPro implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const isPro = args.object['isPro'];
    return isPro ? true : value !== undefined && value !== null;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} is required when isPro is false`;
  }
}

export class CreateSubscriptionDto {
  @IsString()
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  description?: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsBoolean()
  isPro?: boolean;

  @IsArray()
  @Type(() => String)
  features: string[];

  @IsArray()
  @IsEnum(UserRole, { each: true })
  rolesAllowed: UserRole[];

  @IsOptional()
  @IsNumber()
  @Validate(IsRequiredIfNotPro, {
    message: 'maxGigsPerMonth is required when isPro is false',
  })
  @Transform(({ value, obj }) => (obj.isPro ? null : value))
  maxGigsPerMonth: number | null;

  @IsOptional()
  @IsNumber()
  @Validate(IsRequiredIfNotPro, {
    message: 'maxBidsPerMonth is required when isPro is false',
  })
  @Transform(({ value, obj }) => (obj.isPro ? null : value))
  maxBidsPerMonth: number | null;

  @IsBoolean()
  canGetBadges: boolean;
}

export class UpdateSubscriptionDto extends PartialType(CreateSubscriptionDto) {}
