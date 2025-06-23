import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { SubscriptionPlan } from '../subscription-plan/subscription-plan.schema';

@Injectable()
export class PlansService {
  constructor(
    @InjectModel(SubscriptionPlan.name)
    private readonly subscriptionPlanModel: Model<SubscriptionPlan>,
  ) {}

  async findAll() {
    const baseQuery: any = { isDeleted: false };
    const items = await this.subscriptionPlanModel
      .find(baseQuery)
      .sort({ price: 1 })
      .lean();

    return {
      message: 'Subscription plans retrieved successfully',
      data: items,
      status: HttpStatus.OK,
    };
  }
}
