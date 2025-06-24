import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

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

  async findOne(id: string | Types.ObjectId) {
    let objectId: Types.ObjectId;

    if (typeof id === 'string') {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid subscription plan ID');
      }
      objectId = new Types.ObjectId(id);
    } else {
      objectId = id;
    }

    const plan = await this.subscriptionPlanModel.findOne({
      _id: objectId,
      isDeleted: false,
    });

    if (!plan) {
      throw new NotFoundException('Subscription plan not found');
    }
    return plan;
  }

  async update(id: string | Types.ObjectId, dto: UpdateSubscriptionDto) {
    let objectId: Types.ObjectId;

    if (typeof id === 'string') {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid subscription plan ID');
      }
      objectId = new Types.ObjectId(id);
    } else {
      objectId = id;
    }

    const trimmedDto = this.trimStringFields(dto);
    if (trimmedDto.name) {
      const existing = await this.subscriptionPlanModel.findOne({
        name: trimmedDto.name,
        _id: { $ne: objectId },
        isDeleted: false,
      });
      if (existing) {
        throw new BadRequestException(
          'A subscription plan with this name already exists',
        );
      }
    }

    const updatedPlan = await this.subscriptionPlanModel.findByIdAndUpdate(
      objectId,
      { $set: trimmedDto },
      { new: true, runValidators: true },
    );

    if (!updatedPlan) {
      throw new NotFoundException('Subscription plan not found');
    }

    return updatedPlan;
  }

  async delete(id: string | Types.ObjectId) {
    let objectId: Types.ObjectId;

    if (typeof id === 'string') {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid subscription plan ID');
      }
      objectId = new Types.ObjectId(id);
    } else {
      objectId = id;
    }

    const deleted = await this.subscriptionPlanModel.findByIdAndUpdate(
      objectId,
      { isDeleted: true },
      { new: true },
    );

    if (!deleted) {
      throw new NotFoundException('Subscription plan not found');
    }

    return { message: 'Subscription plan deleted successfully' };
  }

  async countPlans(): Promise<number> {
    return this.subscriptionPlanModel.countDocuments();
  }
}
