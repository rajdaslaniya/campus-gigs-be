import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// schema
import { ContactUs, ContactUsDocument } from './contact-us.schema';

// dtos
import { CreateContactUsDto, UpdateContactUsStatusDto, BulkDeleteContactUsDto, ContactUsQueryParams, GenerateContactUsResponseDto } from './contact-us.dto';
import { AiService } from '../faqs/ai.service';
import { CONTACT_US_RESPONSE_PROMPT } from '../../utils/helper';

@Injectable()
export class ContactUsService {
  constructor(
    @InjectModel(ContactUs.name)
    private contactUsModel: Model<ContactUsDocument>,
    private readonly aiService: AiService,
  ) {}

  async create(createContactUsDto: CreateContactUsDto): Promise<ContactUs> {
    const createdEntry = new this.contactUsModel(createContactUsDto);
    return createdEntry.save();
  }

  async findAll(query: ContactUsQueryParams): Promise<any> {
    const { page = 1, pageSize = 10, sortBy = 'createdAt', sortOrder = 'asc', search } = query;
    const skip = (page - 1) * pageSize;
    const baseQuery: any = {};
    if (search) {
      baseQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }
    const [total, items] = await Promise.all([
      this.contactUsModel.countDocuments(baseQuery),
      this.contactUsModel.find(baseQuery)
        .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
    ]);
    const totalPages = Math.ceil(total / pageSize);
    return {
      message: 'Contact Us entries retrieved successfully',
      data: items,
      meta: {
        total,
        totalPages,
        page,
        pageSize,
      },
    };
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
    
    return { deletedCount: result.deletedCount };
  }

  async generateContactUsResponse(generateContactUsResponseDto: GenerateContactUsResponseDto): Promise<{ responseSubject: string, responseMessage: string }> {
    const prompt = CONTACT_US_RESPONSE_PROMPT(generateContactUsResponseDto.subject, generateContactUsResponseDto.message);
    const aiResult = await this.aiService.generateAnswer(prompt);
    // Parse the AI result for subject and message
    const subjectMatch = aiResult.match(/Response Subject:\s*(.*)/i);
    const messageMatch = aiResult.match(/Response Message:\s*([\s\S]*)/i);
    return {
      responseSubject: subjectMatch ? subjectMatch[1].trim() : '',
      responseMessage: messageMatch ? messageMatch[1].trim() : aiResult.trim(),
    };
  }
}
