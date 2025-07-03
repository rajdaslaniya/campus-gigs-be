import { Module } from '@nestjs/common';
import { SubscriptionCronService } from './subscription-cron.service';
import { SubscriptionPlanModule } from '../subscription-plan/subscription-plan.module';
import { BuyPlanModule } from '../buy-plan/buy-plan.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, SubscriptionPlanModule, BuyPlanModule],
  providers: [SubscriptionCronService],
  exports: [SubscriptionCronService],
})
export class SubscriptionCronModule {}
