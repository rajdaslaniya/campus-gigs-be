import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';

import { BuyPlan, BuyPlanDocument } from './buy-plan.schema';
import { CreateBuyPlanDto } from './dto/create-buy-plan.dto';
import { SubscriptionPlanService } from '../subscription-plan/subscription-plan.service';
import { UserService } from '../user/user.service';
import { BUY_PLAN_STATUS } from 'src/utils/enums';

@Injectable()
export class BuyPlanService {
  constructor(
    @InjectModel(BuyPlan.name) private buyPlanModel: Model<BuyPlanDocument>,
    @Inject(forwardRef(() => SubscriptionPlanService))
    private readonly subscriptionPlanService: SubscriptionPlanService,
    private readonly userService: UserService,
  ) {}

  async create(
    createBuyPlanDto: CreateBuyPlanDto,
    userId: string,
  ): Promise<BuyPlan> {
    // Check if user exists
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Validate subscription plan ID format
    if (
      !createBuyPlanDto.subscriptionPlanId ||
      !mongoose.Types.ObjectId.isValid(createBuyPlanDto.subscriptionPlanId)
    ) {
      throw new BadRequestException('Invalid subscription plan ID format');
    }

    // Check if subscription plan exists
    const subscriptionPlan = await this.subscriptionPlanService.findOne(
      createBuyPlanDto.subscriptionPlanId,
    );
    if (!subscriptionPlan) {
      throw new NotFoundException('Subscription plan not found');
    }

    // Check if user has an active plan
    const activePlan = await this.buyPlanModel.findOne({
      userId: new Types.ObjectId(userId),
      status: BUY_PLAN_STATUS.ACTIVE,
    });

    // If user has an active plan
    if (activePlan) {
      // If trying to buy the same plan that's already active
      if (
        activePlan.subscriptionPlanId.toString() ===
        createBuyPlanDto.subscriptionPlanId
      ) {
        throw new ConflictException(
          'You already have an active subscription for this plan',
        );
      }

      // Mark existing active plan as inactive
      activePlan.status = BUY_PLAN_STATUS.CANCELLED;
      activePlan.subscriptionExpiryDate = new Date();
      await activePlan.save();
    }

    // Calculate subscription expiry date (same day next month)
    const subscriptionExpiryDate = new Date();
    subscriptionExpiryDate.setMonth(subscriptionExpiryDate.getMonth() + 1);

    // Create new plan purchase with the current price
    const createdPlan = new this.buyPlanModel({
      userId: new Types.ObjectId(userId),
      subscriptionPlanId: new Types.ObjectId(
        createBuyPlanDto.subscriptionPlanId,
      ),
      price: subscriptionPlan.price,
      status: BUY_PLAN_STATUS.ACTIVE,
      subscriptionExpiryDate,
    });

    return createdPlan.save();
  }

  async findActivePlan(userId: string): Promise<BuyPlan | null> {
    return this.buyPlanModel
      .findOne({
        userId: new Types.ObjectId(userId),
        status: BUY_PLAN_STATUS.ACTIVE,
      })
      .populate('subscriptionPlanId')
      .exec();
  }

  async cancelPlan(planId: string, userId: string): Promise<BuyPlan> {
    const plan = await this.buyPlanModel.findOne({
      _id: new Types.ObjectId(planId),
      userId: new Types.ObjectId(userId),
      status: BUY_PLAN_STATUS.ACTIVE,
    });

    if (!plan) {
      throw new NotFoundException('Active plan not found');
    }

    plan.status = BUY_PLAN_STATUS.CANCELLED;
    return plan.save();
  }
}
