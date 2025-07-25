import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';

import { FaqService } from './faq.service';
import {
  CreateFaqDto,
  UpdateFaqDto,
  BulkCreateFaqDto,
  FaqQueryParams,
} from './faq.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('faqs')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() dto: CreateFaqDto) {
    return this.faqService.create(dto);
  }

  @Post('bulk')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  createMany(@Body() bulkDto: BulkCreateFaqDto) {
    return this.faqService.createMany(bulkDto.faqs);
  }

  @Get()
  findAll(@Query() query: FaqQueryParams) {
    return this.faqService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.faqService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateFaqDto) {
    return this.faqService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.faqService.remove(id);
  }

  @Post('generate-answer')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async generateAnswer(@Body('question') question: string) {
    return this.faqService.generateAnswer(question);
  }
}
