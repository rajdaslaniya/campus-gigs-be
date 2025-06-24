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
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { BuyPlanService } from './buy-plan.service';
import { CreateBuyPlanDto } from './dto/create-buy-plan.dto';
import { BuyPlan } from './buy-plan.schema';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('subscription-plan/buy-plan')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BuyPlanController {
  constructor(private readonly buyPlanService: BuyPlanService) {}

  @Post()
  async create(
    @Body() createBuyPlanDto: CreateBuyPlanDto,
    @Request() req,
  ): Promise<BuyPlan> {
    return this.buyPlanService.create(createBuyPlanDto, req.user.id);
  }

  @Get('my-plan')
  async findMyPlan(@Request() req): Promise<BuyPlan> {
    const plan = await this.buyPlanService.findActivePlan(req.user.id);
    if (!plan) {
      throw new NotFoundException('No active plan found');
    }
    return plan;
  }

  @Delete(':id/cancel')
  async cancel(
    @Param('id') id: string,
    @Request() req,
  ): Promise<{ message: string }> {
    await this.buyPlanService.cancelPlan(id, req.user.id);
    return { message: 'Plan cancelled successfully' };
  }
}
