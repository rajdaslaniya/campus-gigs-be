import { Controller, Get, HttpStatus } from '@nestjs/common';

import { PlansService } from 'src/modules/plans/plans.service';

@Controller('subscription/plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Get()
  async findAll() {
    try {
      const result = await this.plansService.findAll();
      return result;
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to fetch subscription users',
        error: error.message,
      };
    }
  }
}
