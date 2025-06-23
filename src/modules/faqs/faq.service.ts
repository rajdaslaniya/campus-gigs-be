import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Faq, FaqDocument } from './faq.schema';
import { CreateFaqDto, UpdateFaqDto } from './faq.dto';

@Injectable()
export class FaqService {
  constructor(@InjectModel(Faq.name) private faqModel: Model<FaqDocument>) {}

  async create(dto: CreateFaqDto) {
    return this.faqModel.create(dto);
  }

  async findAll() {
    return this.faqModel.find();
  }

  async findOne(id: string) {
    const faq = await this.faqModel.findById(id);
    if (!faq) throw new NotFoundException('FAQ not found');
    return faq;
  }

  async update(id: string, dto: UpdateFaqDto) {
    const updated = await this.faqModel.findByIdAndUpdate(id, dto, { new: true });
    if (!updated) throw new NotFoundException('FAQ not found');
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.faqModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('FAQ not found');
    return { message: 'Deleted successfully' };
  }

  async createMany(dtos: CreateFaqDto[]) {
    return this.faqModel.insertMany(dtos);
  }
}
