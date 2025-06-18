import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

// services
import { ContactUsService } from './contact-us.service';

// dto
import { CreateContactUsDto } from './contact-us.dto';

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
  async getAll(): Promise<ContactUs[]> {
    return this.contactUsService.findAll();
  }
}
