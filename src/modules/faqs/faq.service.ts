import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Faq, FaqDocument } from './faq.schema';
import { CreateFaqDto, UpdateFaqDto, FaqQueryParams } from './faq.dto';

@Injectable()
export class FaqService {
  constructor(@InjectModel(Faq.name) private faqModel: Model<FaqDocument>) {}

  async create(dto: CreateFaqDto) {
    return this.faqModel.create(dto);
  }

  async findAll(query: FaqQueryParams) {
    const { page = 1, pageSize = 10, sortBy = 'createdAt', sortOrder = 'asc', search } = query;
    const skip = (page - 1) * pageSize;
    const baseQuery: any = {};
    if (search) {
      baseQuery.$or = [
        { question: { $regex: search, $options: 'i' } },
        { answer: { $regex: search, $options: 'i' } },
      ];
    }
    const [total, items] = await Promise.all([
      this.faqModel.countDocuments(baseQuery),
      this.faqModel.find(baseQuery)
        .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
    ]);
    const totalPages = Math.ceil(total / pageSize);
    return {
      message: 'FAQs retrieved successfully',
      data: items,
      meta: {
        total,
        totalPages,
        page,
        pageSize,
      },
    };
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
