import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
  IsIn,
  IsInt,
  Min,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  Validate,
} from 'class-validator';

import { PartialType } from '@nestjs/mapped-types';
import { UserRole } from 'src/common/utils/enums';

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

export class SubscriptionPlanQueryParams extends PaginationParams {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  search?: string;

  @IsOptional()
  @IsString()
  @IsIn(
    [
      'name',
      'price',
      'created_at',
      'most_popular',
      'max_gig_per_month',
      'max_bid_per_month',
      'can_get_badge',
    ],
    {
      message: 'Invalid sort field',
    },
  )
  sortBy: string = 'price';

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'], {
    message: 'Sort order must be either asc or desc',
  })
  sortOrder: 'asc' | 'desc' = 'asc';
}

@ValidatorConstraint({ name: 'isRequiredIfNotPro', async: false })
class IsRequiredIfNotPro implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const isPro = args.object['is_pro'];
    return isPro ? true : value !== undefined && value !== null;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} is required when is_pro is false`;
  }
}

export class CreateSubscriptionDto {
  @IsString()
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsString()
  @Transform(({ value }) => value?.trim())
  description: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsBoolean()
  is_pro?: boolean;

  @IsArray()
  @Type(() => String)
  features: string[];

  @IsArray()
  @IsEnum(UserRole, { each: true })
  rolesAllowed: UserRole[];

  @IsOptional()
  @IsNumber()
  @Validate(IsRequiredIfNotPro, {
    message: 'max_gig_per_month is required when isPro is false',
  })
  @Transform(({ value, obj }) => (obj.is_pro ? null : value))
  max_gig_per_month: number | null;

  @IsOptional()
  @IsNumber()
  @Validate(IsRequiredIfNotPro, {
    message: 'max_bid_per_month is required when is_pro is false',
  })
  @Transform(({ value, obj }) => (obj.is_pro ? null : value))
  max_bid_per_month: number | null;

  @IsBoolean()
  most_popular: boolean;

  @IsString()
  button_text: string;

  @IsString()
  icon: string;

  @IsBoolean()
  canGetBadges: boolean;
}

export class UpdateSubscriptionDto extends PartialType(CreateSubscriptionDto) {}
