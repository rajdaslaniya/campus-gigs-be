import { forwardRef, Module } from '@nestjs/common';

import { BuyPlanService } from './buy-plan.service';
import { BuyPlanController } from './buy-plan.controller';
import { SubscriptionPlanModule } from '../subscription-plan/subscription-plan.module';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => SubscriptionPlanModule),
    UserModule,
    PrismaModule,
  ],
  controllers: [BuyPlanController],
  providers: [BuyPlanService],
  exports: [BuyPlanService],
})
export class BuyPlanModule {}
