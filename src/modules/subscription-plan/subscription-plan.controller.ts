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
  BadRequestException,
} from '@nestjs/common';
import { Types } from 'mongoose';

import { SubscriptionPlanService } from './subscription-plan.service';
import {
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
  SubscriptionPlanQueryParams,
} from './subscription-plan.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('subscription-plan')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubscriptionPlanController {
  constructor(private readonly service: SubscriptionPlanService) {}

  @Post()
  @Roles('admin')
  create(@Body() dto: CreateSubscriptionDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles('admin')
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() query: SubscriptionPlanQueryParams) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @Roles('admin')
  findOne(@Param('id') id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid subscription plan ID');
    }
    return this.service.findOne(new Types.ObjectId(id));
  }

  @Put(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() dto: UpdateSubscriptionDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid subscription plan ID');
    }
    return this.service.update(new Types.ObjectId(id), dto);
  }

  @Delete(':id')
  @Roles('admin')
  delete(@Param('id') id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid subscription plan ID');
    }
    return this.service.delete(new Types.ObjectId(id));
  }
}
