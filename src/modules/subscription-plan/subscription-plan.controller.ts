import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';

import { SubscriptionPlanService } from './subscription-plan.service';
import {
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
  SubscriptionPlanQueryParams,
} from './subscription-plan.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('subscription')
export class SubscriptionPlanController {
  constructor(private readonly service: SubscriptionPlanService) {}

  @Post('plan')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() dto: CreateSubscriptionDto) {
    return this.service.create(dto);
  }

  @Get('plan')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() query: SubscriptionPlanQueryParams) {
    return this.service.findAll(query);
  }

  @Get('plan/:id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Put('plan/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSubscriptionDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete('plan/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }

  @Get('plan-all')
  getAllPlanWithoutFilter() {
    return this.service.findAllPlanWithoutFilter();
  }
}
