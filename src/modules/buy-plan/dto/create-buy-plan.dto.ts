import { IsNotEmpty, IsMongoId } from 'class-validator';

export class CreateBuyPlanDto {
  @IsNotEmpty()
  @IsMongoId()
  subscriptionPlanId: string;
}
