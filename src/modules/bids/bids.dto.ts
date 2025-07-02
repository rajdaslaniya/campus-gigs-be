import { IsEnum, IsInt, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { BID_STATUS, PAYMENT_TYPE } from "src/utils/enums";

export class CreateBidDto {

  @IsOptional()
  @IsNumber()
  @IsInt()
  provider_id: number;

  @IsString()
  gig_id: string;

  @IsOptional()
  @IsEnum(BID_STATUS)
  status: BID_STATUS.PENDING;

  @IsOptional()
  @IsEnum(PAYMENT_TYPE)
  payment_type: PAYMENT_TYPE.HOURLY;

  @IsNumber()
  @Min(0)
  bid_amount: number;

  @IsString()
  description: string;
}