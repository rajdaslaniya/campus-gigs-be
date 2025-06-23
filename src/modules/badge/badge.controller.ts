import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { BadgeService } from './badge.service';
import { CreateBadgeDto, UpdateBadgeDto } from './badge.dto';

@Controller('badge')
export class BadgeController {
  constructor(private readonly badgeService: BadgeService) {}

  @Post()
  create(@Body() dto: CreateBadgeDto) {
    return this.badgeService.create(dto);
  }

  @Get()
  findAll() {
    return this.badgeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.badgeService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBadgeDto) {
    return this.badgeService.update(id, dto);
  }

  @Delete(':id')
  softDelete(@Param('id') id: string) {
    return this.badgeService.softDelete(id);
  }
}
