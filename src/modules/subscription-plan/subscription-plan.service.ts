import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
  SubscriptionPlanQueryParams,
} from './subscription-plan.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PROFILE_TYPE } from '@prisma/client';

const enumValues = Object.values(PROFILE_TYPE);

@Injectable()
export class SubscriptionPlanService {
  constructor(private prismaService: PrismaService) {}

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
    const planCount = await this.prismaService.subscriptionPlan.count();
    if (planCount >= 3) {
      throw new ConflictException({
        status: HttpStatus.CONFLICT,
        message: 'Maximum limit of 3 subscription plans reached',
      });
    }

    const trimmedDto = this.trimStringFields(dto);
    const existing = await this.prismaService.subscriptionPlan.findFirst({
      where: {
        name: trimmedDto.name,
      },
    });
    if (existing) {
      throw new ConflictException({
        status: HttpStatus.CONFLICT,
        message: 'Subscription plan with this name already exists',
      });
    }
    const created = await this.prismaService.subscriptionPlan.create({
      data: trimmedDto,
    });
    return {
      message: 'Subscription plan created successfully',
      data: created,
      status: HttpStatus.CREATED,
    };
  }

  async findAll(query: SubscriptionPlanQueryParams) {
    const {
      page = 1,
      pageSize = 10,
      sortBy = 'created_at',
      sortOrder = 'desc',
      search = '',
    } = query;

    const skip = (page - 1) * pageSize;

    // Build the where clause
    const where: any = { is_deleted: false };

    // Add search condition if search term exists
    if (search) {
      const searchTerm = search.toLowerCase();
      const numericSearch = Number(search);
      const isNumeric = !isNaN(numericSearch);

      where.OR = [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
        { button_text: { contains: searchTerm, mode: 'insensitive' } },
        ...(isNumeric
          ? [
              { max_gig_per_month: { equals: numericSearch } },
              { max_bid_per_month: { equals: numericSearch } },
              { price: { equals: numericSearch } },
            ]
          : []),
        // For array fields, we need to check if any element contains the search term
        { features: { has: searchTerm } },
        // Check if searchTerm matches any PROFILE_TYPE enum value
        ...(enumValues.includes(searchTerm as PROFILE_TYPE)
          ? [{ roles_allowed: { has: searchTerm as PROFILE_TYPE } }]
          : []),
      ];
    }

    // Execute queries in parallel
    const [total, items] = await Promise.all([
      this.prismaService.subscriptionPlan.count({ where }),
      this.prismaService.subscriptionPlan.findMany({
        where,
        orderBy: {
          [sortBy]: sortOrder.toLowerCase() as 'asc' | 'desc',
        },
        skip,
        take: pageSize,
      }),
    ]);

    const totalPages = Math.ceil(total / pageSize);

    return {
      message: 'Subscription plans retrieved successfully',
      data: items,
      meta: {
        total,
        page,
        limit: pageSize,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
      status: HttpStatus.OK,
    };
  }

  async findOne(id: number) {
    const plan = await this.prismaService.subscriptionPlan.findUnique({
      where: {
        id,
      },
    });

    if (!plan) {
      throw new NotFoundException('Subscription plan not found');
    }
    return plan;
  }

  async update(id: number, dto: UpdateSubscriptionDto) {
    const plan = await this.prismaService.subscriptionPlan.findUnique({
      where: {
        id,
      },
    });

    if (!plan) {
      throw new NotFoundException('Subscription plan not found');
    }

    const trimmedDto = this.trimStringFields(dto);
    if (trimmedDto.name) {
      const existing = await this.prismaService.subscriptionPlan.findFirst({
        where: {
          name: trimmedDto.name,
          NOT: {
            id,
          },
        },
      });
      if (existing) {
        throw new BadRequestException(
          'A subscription plan with this name already exists',
        );
      }
    }

    const updatedPlan = await this.prismaService.subscriptionPlan.update({
      where: {
        id,
      },
      data: trimmedDto,
    });

    return updatedPlan;
  }

  async delete(id: number) {
    const deleted = await this.prismaService.subscriptionPlan.update({
      where: {
        id,
      },
      data: { is_deleted: true },
    });

    if (!deleted) {
      throw new NotFoundException('Subscription plan not found');
    }

    return { message: 'Subscription plan deleted successfully' };
  }

  async countPlans(): Promise<number> {
    return this.prismaService.subscriptionPlan.count();
  }

  async findAllPlanWithoutFilter() {
    const items = await this.prismaService.subscriptionPlan.findMany({
      where: { is_deleted: false },
      orderBy: { price: 'asc' },
    });

    return {
      message: 'Subscription plans retrieved successfully',
      data: items,
      status: HttpStatus.OK,
    };
  }

  async findFreePlan() {
    const plan = await this.prismaService.subscriptionPlan.findFirst({
      where: {
        price: {
          equals: 0,
        },
      },
    });

    return plan;
  }
}
