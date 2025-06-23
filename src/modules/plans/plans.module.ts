import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  SubscriptionPlan,
  SubscriptionPlanSchema,
} from '../subscription-plan/subscription-plan.schema';
import { PlansService } from './plans.service';
import { PlansController } from './plans.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SubscriptionPlan.name, schema: SubscriptionPlanSchema },
    ]),
  ],
  providers: [PlansService],
  controllers: [PlansController],
  exports: [PlansService],
})
export class PlansModule {}
