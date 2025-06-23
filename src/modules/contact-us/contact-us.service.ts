import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// schema
import { ContactUs, ContactUsDocument } from './contact-us.schema';

// dtos
import { CreateContactUsDto, UpdateContactUsStatusDto, BulkDeleteContactUsDto } from './contact-us.dto';

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

  async updateStatus(id: string, updateStatusDto: UpdateContactUsStatusDto): Promise<ContactUs | null> {
    return this.contactUsModel.findByIdAndUpdate(
      id,
      { status: updateStatusDto.status },
      { new: true },
    ).exec();
  }

  async deleteMany(ids: string[]): Promise<{ deletedCount: number }> {

    const result = await this.contactUsModel.deleteMany({ _id: { $in: ids } });
    console.log(">>>>>>>>>>>>>>, ", ids);
    
    return { deletedCount: result.deletedCount };
  }
}
