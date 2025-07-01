import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBuyPlanDto {
  @IsNotEmpty()
  @IsNumber()
  subscription_plan_id: number;
}
