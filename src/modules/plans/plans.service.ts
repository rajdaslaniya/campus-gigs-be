import { HttpStatus, Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PlansService {
  constructor(private prismaService: PrismaService) {}

  async findAll() {
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
}
