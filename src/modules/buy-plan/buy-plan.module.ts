import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BuyPlan, BuyPlanSchema } from './buy-plan.schema';
import { BuyPlanService } from './buy-plan.service';
import { BuyPlanController } from './buy-plan.controller';
import { SubscriptionPlanModule } from '../subscription-plan/subscription-plan.module';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: BuyPlan.name, schema: BuyPlanSchema }]),
    forwardRef(() => SubscriptionPlanModule),
    UserModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [BuyPlanController],
  providers: [BuyPlanService],
  exports: [BuyPlanService],
})
export class BuyPlanModule {}
