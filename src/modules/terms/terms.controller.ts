import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { TermsService } from './terms.service';
import { CreateTermsDto, UpdateTermsDto } from './terms.dto';

@Controller('terms-conditions')
export class TermsController {
  constructor(private readonly termsService: TermsService) {}

  @Post()
  create(@Body() dto: CreateTermsDto) {
    return this.termsService.create(dto);
  }

  @Get()
  findAll() {
    return this.termsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.termsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTermsDto) {
    return this.termsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.termsService.remove(id);
  }
}
