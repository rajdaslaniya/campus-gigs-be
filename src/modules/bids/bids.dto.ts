import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { BID_STATUS, PAYMENT_TYPE } from "src/utils/enums";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/common/guards/jwt.auth.guard";

@UseGuards(JwtAuthGuard)
export class CreateBidDto {
  @IsNumber()
  gig_id: number;

  @IsNumber()
  provider_id: number;

  @IsOptional()
  @IsEnum(BID_STATUS)
  status: BID_STATUS.PENDING;

  @IsOptional()
  @IsEnum(PAYMENT_TYPE)
  payment_type: PAYMENT_TYPE.HOURLY;

  @IsNumber()
  bid_amount: number;

  @IsString()
  description: string;
}