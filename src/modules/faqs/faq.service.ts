import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateFaqDto, UpdateFaqDto, FaqQueryParams } from './faq.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../shared/ai.service';

@Injectable()
export class FaqService {
  constructor(
    private prisma: PrismaService,
    private readonly aiService: AiService,
  ) {}

  async create(dto: CreateFaqDto) {
    return this.prisma.faqs.create({ data: dto });
  }

  async findAll(query: FaqQueryParams) {
    const {
      page = 1,
      pageSize = 10,
      sortBy = 'created_at',
      sortOrder = 'asc',
      search,
    } = query;
    const skip = (page - 1) * pageSize;
    const baseQuery: any = {};
    if (search) {
      baseQuery.OR = [
        { question: { contains: search, mode: 'insensitive' } },
        { answer: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, items] = await Promise.all([
      this.prisma.faqs.count({ where: baseQuery }),
      this.prisma.faqs.findMany({
        where: baseQuery,
        orderBy: { [sortBy]: sortOrder === 'asc' ? 'asc' : 'desc' },
        skip,
        take: pageSize,
      }),
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

  async findOne(id: number) {
    const faq = await this.prisma.faqs.findUnique({ where: { id } });
    if (!faq) throw new NotFoundException('FAQ not found');
    return faq;
  }

  async update(id: number, dto: UpdateFaqDto) {
    const updated = await this.prisma.faqs.update({ where: { id }, data: dto });
    if (!updated) throw new NotFoundException('FAQ not found');
    return updated;
  }

  async remove(id: number) {
    const deleted = await this.prisma.faqs.delete({ where: { id } });
    if (!deleted) throw new NotFoundException('FAQ not found');
    return { message: 'Deleted successfully' };
  }

  async createMany(dto: CreateFaqDto[]) {
    return this.prisma.faqs.createMany({ data: dto });
  }

  async generateAnswer(question: string): Promise<{ answer: string }> {
    const prompt = `Generate a short, clear answer for the following FAQ question in 1-2 sentences. Avoid unnecessary details and keep the tone professional yet friendly.\n\nQuestion: ${question}\nAnswer:`;
    const answer = await this.aiService.generateAnswer(prompt);
    return { answer };
  }
}
