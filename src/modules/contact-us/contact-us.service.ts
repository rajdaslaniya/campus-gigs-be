import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// schema
import { ContactUs, ContactUsDocument } from './contact-us.schema';

// dtos
import { CreateContactUsDto } from './contact-us.dto';

@Injectable()
export class ContactUsService {
  constructor(
    @InjectModel(ContactUs.name)
    private contactUsModel: Model<ContactUsDocument>,
  ) {}

  async create(createContactUsDto: CreateContactUsDto): Promise<ContactUs> {
    const createdEntry = new this.contactUsModel(createContactUsDto);
    return createdEntry.save();
  }

  async findAll(): Promise<ContactUs[]> {
    return this.contactUsModel.find().sort({ createdAt: -1 }).exec();
  }
}
