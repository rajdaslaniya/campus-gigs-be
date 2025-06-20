import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { FaqService } from './faq.service';
import { CreateFaqDto, UpdateFaqDto, BulkCreateFaqDto } from './faq.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';

@Controller('faqs')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateFaqDto) {
    return this.faqService.create(dto);
  }

  @Post('bulk')
  @UseGuards(JwtAuthGuard)
  createMany(@Body() bulkDto: BulkCreateFaqDto) {
    return this.faqService.createMany(bulkDto.faqs);
  }

  @Get()
  findAll() {
    return this.faqService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.faqService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() dto: UpdateFaqDto) {
    return this.faqService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.faqService.remove(id);
  }
}
