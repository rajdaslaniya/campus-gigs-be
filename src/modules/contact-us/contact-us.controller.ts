import { Body, Controller, Get, Post, UseGuards, Patch, Param, Delete, Query } from '@nestjs/common';

// services
import { ContactUsService } from './contact-us.service';

// dto
import { CreateContactUsDto, UpdateContactUsStatusDto, BulkDeleteContactUsDto, ContactUsQueryParams } from './contact-us.dto';

// schema
import { ContactUs } from './contact-us.schema';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('contact-us')
export class ContactUsController {
  constructor(private readonly contactUsService: ContactUsService) {}

  @Post()
  async create(@Body() dto: CreateContactUsDto): Promise<ContactUs> {
    return this.contactUsService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getAll(@Query() query: ContactUsQueryParams) {
    return this.contactUsService.findAll(query);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateContactUsStatusDto,
  ) {
    return this.contactUsService.updateStatus(id, updateStatusDto);
  }

  @Post('bulk-delete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async deleteMany(@Body() bulkDeleteDto: BulkDeleteContactUsDto) {
    return this.contactUsService.deleteMany(bulkDeleteDto.ids);
  }
}
