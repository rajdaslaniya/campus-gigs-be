import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { CreateBuyPlanDto } from './dto/create-buy-plan.dto';
import { BUY_PLAN_STATUS } from 'src/utils/enums';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BuyPlanService {
  constructor(private prismaService: PrismaService) {}

  async create(createBuyPlanDto: CreateBuyPlanDto, userId: number) {
    // Check if user exists
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if subscription plan exists
    const subscriptionPlan =
      await this.prismaService.subscriptionPlan.findUnique({
        where: {
          id: createBuyPlanDto.subscription_plan_id,
        },
      });
    if (!subscriptionPlan) {
      throw new NotFoundException('Subscription plan not found');
    }

    // Check if user has an active plan
    const activePlan = await this.prismaService.subscriptionPlanBuy.findFirst({
      where: {
        user_id: userId,
        status: BUY_PLAN_STATUS.ACTIVE,
      },
    });

    // If user has an active plan
    if (activePlan) {
      // If trying to buy the same plan that's already active
      if (
        activePlan.subscription_plan_id ===
        createBuyPlanDto.subscription_plan_id
      ) {
        throw new ConflictException(
          'You already have an active subscription for this plan',
        );
      }

      // Mark existing active plan as inactive
      activePlan.status = BUY_PLAN_STATUS.CANCELLED;
      activePlan.subscription_expiry_date = new Date();
      await this.prismaService.subscriptionPlanBuy.update({
        where: {
          id: activePlan.id,
        },
        data: {
          status: BUY_PLAN_STATUS.CANCELLED,
          subscription_expiry_date: new Date(),
        },
      });
    }

    // Calculate subscription expiry date (same day next month)
    const subscriptionExpiryDate = new Date();
    subscriptionExpiryDate.setMonth(subscriptionExpiryDate.getMonth() + 1);

    // Create new plan purchase with the current price
    const createdPlan = await this.prismaService.subscriptionPlanBuy.create({
      data: {
        user_id: userId,
        subscription_plan_id: createBuyPlanDto.subscription_plan_id,
        price: subscriptionPlan.price,
        status: BUY_PLAN_STATUS.ACTIVE,
        subscription_expiry_date: subscriptionExpiryDate,
      },
    });

    return createdPlan;
  }

  async findActivePlan(userId: number) {
    return this.prismaService.subscriptionPlanBuy.findFirst({
      where: {
        user_id: userId,
        status: BUY_PLAN_STATUS.ACTIVE,
      },
      include: {
        subscription_plan: true,
      },
    });
  }

  async cancelPlan(planId: number, userId: number) {
    const plan = await this.prismaService.subscriptionPlanBuy.findFirst({
      where: {
        id: planId,
        user_id: userId,
        status: BUY_PLAN_STATUS.ACTIVE,
      },
    });

    if (!plan) {
      throw new NotFoundException('Active plan not found');
    }

    await this.prismaService.subscriptionPlanBuy.update({
      where: {
        id: planId,
      },
      data: {
        status: BUY_PLAN_STATUS.CANCELLED,
        subscription_expiry_date: new Date(),
      },
    });
  }
}
