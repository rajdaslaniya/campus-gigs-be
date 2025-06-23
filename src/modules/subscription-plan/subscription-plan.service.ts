import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { SubscriptionPlan } from './subscription-plan.schema';
import {
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
  SubscriptionPlanQueryParams,
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
    // Check if maximum number of plans (3) has been reached
    const planCount = await this.subscriptionPlanModel.countDocuments();
    if (planCount >= 3) {
      throw new ConflictException({
        status: HttpStatus.CONFLICT,
        message: 'Maximum limit of 3 subscription plans reached',
      });
    }

    const trimmedDto = this.trimStringFields(dto);
    const existing = await this.subscriptionPlanModel.findOne({
      name: { $regex: `^${trimmedDto.name}$`, $options: 'i' },
    });
    if (existing) {
      throw new ConflictException({
        status: HttpStatus.CONFLICT,
        message: 'Subscription plan with this name already exists',
      });
    }
    const created = await this.subscriptionPlanModel.create(trimmedDto);
    return {
      message: 'Subscription plan created successfully',
      data: created,
      status: HttpStatus.CREATED,
    };
  }

  async findAll(query: SubscriptionPlanQueryParams) {
    const { page, pageSize, search, sortBy, sortOrder } = query;
    const skip = (page - 1) * pageSize;

    // Build the base query
    const baseQuery: any = { isDeleted: false };

    // Add search condition if search term exists
    if (search) {
      const searchConditions: any[] = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { features: { $in: [new RegExp(search, 'i')] } },
        { rolesAllowed: { $in: [new RegExp(search, 'i')] } },
        { buttonText: { $regex: search, $options: 'i' } },
      ];

      // Handle numeric fields separately
      const numericSearch = Number(search);
      if (!isNaN(numericSearch)) {
        searchConditions.push(
          { maxGigsPerMonth: numericSearch },
          { maxBidsPerMonth: numericSearch },
          { price: numericSearch },
        );
      }

      baseQuery.$or = searchConditions;
    }
    console.log(sortBy, 'SortOrder');
    // Execute queries in parallel
    const [total, items] = await Promise.all([
      this.subscriptionPlanModel.countDocuments(baseQuery),
      this.subscriptionPlanModel
        .find(baseQuery)
        .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
    ]);

    const totalPages = Math.ceil(total / pageSize);

    return {
      message: 'Subscription plans retrieved successfully',
      data: items,
      meta: {
        total,
        totalPages,
        page,
        pageSize,
      },
      status: HttpStatus.OK,
    };
  }

  async findOne(id: string) {
    const plan = await this.subscriptionPlanModel.findOne({
      _id: id,
      isDeleted: false,
    });
    if (!plan) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'Subscription plan not found',
      });
    }
    return {
      message: 'Subscription plan retrieved successfully',
      data: plan,
      status: HttpStatus.OK,
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
        throw new ConflictException({
          status: HttpStatus.CONFLICT,
          message: 'Subscription plan with this name already exists',
        });
      }
    }
    const updated = await this.subscriptionPlanModel.findByIdAndUpdate(
      id,
      trimmedDto,
      {
        new: true,
      },
    );
    if (!updated)
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'Subscription plan not found',
      });
    return {
      message: 'Subscription plan updated successfully',
      data: updated,
      status: HttpStatus.OK,
    };
  }

  async delete(id: string) {
    const deleted = await this.subscriptionPlanModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true },
    );
    if (!deleted)
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'Subscription plan not found',
      });
    return {
      message: 'Subscription plan deleted successfully',
      data: deleted,
      status: HttpStatus.OK,
    };
  }

  async countPlans(): Promise<number> {
    return this.subscriptionPlanModel.countDocuments();
  }
}
