import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubscriptionPlan } from './subscription-plan.schema';
import {
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
} from './subscription-plan.dto';

@Injectable()
export class SubscriptionPlanService {
  constructor(
    @InjectModel(SubscriptionPlan.name)
    private readonly subscriptionPlanModel: Model<SubscriptionPlan>,
  ) {}

  private trimStringFields(dto: any): any {
    const trimmed = { ...dto };
    for (const key in trimmed) {
      if (typeof trimmed[key] === 'string') {
        trimmed[key] = trimmed[key].trim();
      } else if (Array.isArray(trimmed[key])) {
        trimmed[key] = trimmed[key].map((feature: any) => feature.trim());
      }
    }
    return trimmed;
  }

  async create(dto: CreateSubscriptionDto) {
    const trimmedDto = this.trimStringFields(dto);
    const existing = await this.subscriptionPlanModel.findOne({
      name: { $regex: `^${trimmedDto.name}$`, $options: 'i' },
    });
    if (existing) {
      throw new ConflictException(
        'Subscription plan with this name already exists',
      );
    }
    const created = await this.subscriptionPlanModel.create(trimmedDto);
    return {
      message: 'Subscription plan created successfully',
      data: created,
    };
  }

  async findAll() {
    const plans = await this.subscriptionPlanModel
      .find({ isDeleted: false })
      .sort({ price: 1 })
      .lean();
    return {
      message: 'Subscription plans retrieved successfully',
      data: plans,
    };
  }

  async findOne(id: string) {
    const plan = await this.subscriptionPlanModel.findOne({
      _id: id,
      isDeleted: false,
    });
    if (!plan) {
      throw new NotFoundException('Subscription plan not found');
    }
    return {
      message: 'Subscription plan retrieved successfully',
      data: plan,
    };
  }

  async update(id: string, dto: UpdateSubscriptionDto) {
    const trimmedDto = this.trimStringFields(dto);
    if (trimmedDto.name) {
      const existing = await this.subscriptionPlanModel.findOne({
        name: { $regex: `^${trimmedDto.name}$`, $options: 'i' },
        _id: { $ne: id },
        isDeleted: false,
      });
      if (existing) {
        throw new ConflictException(
          'Subscription plan with this name already exists',
        );
      }
    }
    const updated = await this.subscriptionPlanModel.findByIdAndUpdate(
      id,
      trimmedDto,
      {
        new: true,
      },
    );
    if (!updated) throw new NotFoundException('Subscription plan not found');
    return {
      message: 'Subscription plan updated successfully',
      data: updated,
    };
  }

  async delete(id: string) {
    const deleted = await this.subscriptionPlanModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true },
    );
    if (!deleted) throw new NotFoundException('Subscription plan not found');
    return {
      message: 'Subscription plan deleted successfully',
      data: deleted,
    };
  }

  async countPlans(): Promise<number> {
    return this.subscriptionPlanModel.countDocuments();
  }
}
