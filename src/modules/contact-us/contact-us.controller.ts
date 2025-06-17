import { Body, Controller, Get, Post } from '@nestjs/common';

// services
import { ContactUsService } from './contact-us.service';

// dto
import { CreateContactUsDto } from './contact-us.dto';

// schema
import { ContactUs } from './contact-us.schema';

@Controller('contact-us')
export class ContactUsController {
  constructor(private readonly contactUsService: ContactUsService) {}

  @Post()
  async create(@Body() dto: CreateContactUsDto): Promise<ContactUs> {
    return this.contactUsService.create(dto);
  }

  @Get()
  async getAll(): Promise<ContactUs[]> {
    return this.contactUsService.findAll();
  }
}
