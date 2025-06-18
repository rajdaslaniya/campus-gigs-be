import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { TermsService } from './terms.service';
import { CreateTermsDto, UpdateTermsDto } from './terms.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';

@Controller('terms-conditions')
export class TermsController {
  constructor(private readonly termsService: TermsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() dto: UpdateTermsDto) {
    return this.termsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.termsService.remove(id);
  }
}
