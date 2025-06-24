import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { SubscriptionCronService } from './subscription-cron.service';
import { BuyPlan, BuyPlanSchema } from '../buy-plan/buy-plan.schema';
import { SubscriptionPlanModule } from '../subscription-plan/subscription-plan.module';
import { BuyPlanModule } from '../buy-plan/buy-plan.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([{ name: BuyPlan.name, schema: BuyPlanSchema }]),
    SubscriptionPlanModule,
    BuyPlanModule,
  ],
  providers: [SubscriptionCronService],
  exports: [SubscriptionCronService],
})
export class SubscriptionCronModule {}
