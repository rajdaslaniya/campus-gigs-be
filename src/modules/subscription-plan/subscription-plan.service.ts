import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { SubscriptionPlan } from './subscription-plan.schema';
import { 
  SubscriptionPlanDocument, 
  CreateSubscriptionPlanDto, 
  UpdateSubscriptionPlanDto,
  SubscriptionPlanQueryParams 
} from './types/subscription-plan.types';

@Injectable()
export class SubscriptionPlanService {
  private readonly logger = new Logger(SubscriptionPlanService.name);
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

  async create(dto: CreateSubscriptionPlanDto) {
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
    // Set default values for pagination
    const page = query.page || 1;
    const pageSize = query.pageSize || 10;
    const skip = (page - 1) * pageSize;

    // Build the base query
    const filter: Record<string, any> = { isDeleted: false };

    // Add search condition if search term exists
    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { description: { $regex: query.search, $options: 'i' } },
        { features: { $in: [new RegExp(query.search, 'i')] } },
      ];
    }

    // Set up sorting
    const sort: Record<string, 1 | -1> = {};
    if (query.sortBy) {
      const sortOrder = query.sortOrder === 'desc' ? -1 : 1;
      sort[query.sortBy] = sortOrder;
    } else {
      sort.createdAt = -1;
    }

    // Execute queries in parallel
    const [items, total] = await Promise.all([
      this.subscriptionPlanModel
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(pageSize)
        .lean()
        .exec(),
      this.subscriptionPlanModel.countDocuments(filter),
    ]);

    return {
      data: items as unknown as SubscriptionPlanDocument[],
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
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

  async update(id: string | Types.ObjectId, dto: UpdateSubscriptionPlanDto) {
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

  async findFreePlan(): Promise<SubscriptionPlanDocument | null> {
    const plan = await this.subscriptionPlanModel
      .findOne({ price: 0, isDeleted: false })
      .lean()
      .exec();
    
    if (!plan) {
      this.logger.warn('No free subscription plan found');
      return null;
    }
    
    return plan as unknown as SubscriptionPlanDocument;
  }
}
