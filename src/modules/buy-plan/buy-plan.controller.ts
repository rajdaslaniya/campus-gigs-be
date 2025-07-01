import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { BuyPlanService } from './buy-plan.service';
import { CreateBuyPlanDto } from './dto/create-buy-plan.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('subscription-plan')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BuyPlanController {
  constructor(private readonly buyPlanService: BuyPlanService) {}

  @Post('buy-plan')
  async create(
    @Body() createBuyPlanDto: CreateBuyPlanDto,
    @Request() request: any,
  ) {
    return this.buyPlanService.create(createBuyPlanDto, request.user.id);
  }

  @Get('my-plan')
  async findMyPlan(@Request() request: any) {
    const plan = await this.buyPlanService.findActivePlan(request.user.id);
    if (!plan) {
      throw new NotFoundException('No active plan found');
    }
    return plan;
  }

  @Delete('buy-plan/:id/cancel')
  async cancel(
    @Param('id', ParseIntPipe) id: number,
    @Request() request: any,
  ): Promise<{ message: string }> {
    await this.buyPlanService.cancelPlan(id, request.user.id);
    return { message: 'Plan cancelled successfully' };
  }
}
