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
} from '@nestjs/common';

import { SubscriptionPlanService } from './subscription-plan.service';
import {
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
  SubscriptionPlanQueryParams,
} from './subscription-plan.dto';

@Controller('subscription-plan')
export class SubscriptionPlanController {
  constructor(private readonly service: SubscriptionPlanService) {}

  @Post()
  create(@Body() dto: CreateSubscriptionDto) {
    return this.service.create(dto);
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(
    @Query() query: SubscriptionPlanQueryParams
  ) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSubscriptionDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
