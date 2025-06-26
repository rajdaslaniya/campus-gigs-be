import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Terms, TermsDocument } from './terms.schema';
import { Model } from 'mongoose';
import { CreateTermsDto, UpdateTermsDto, GenerateTermsDto } from './terms.dto';
import { UserService } from '../user/user.service';
import { AiService } from '../faqs/ai.service';
import { TERMS_GENERATION_PROMPT } from '../../utils/helper';

@Injectable()
export class TermsService {
  constructor(
    @InjectModel(Terms.name) private termsModel: Model<TermsDocument>, 
    private userService: UserService,
    private readonly aiService: AiService,
  ) {}

  async create(createDto: CreateTermsDto) {
    return this.termsModel.create(createDto);
  }

  async findAll() {
    return this.termsModel.find();
  }

  async findOne(id: string) {
    const term = await this.termsModel.findById(id);
    if (!term) throw new NotFoundException('Term not found');
    return term;
  }

  async update(id: string, updateDto: UpdateTermsDto) {
    const updated = await this.termsModel.findByIdAndUpdate(id, updateDto, { new: true });

    await this.userService.updatePolicyForAllUser();

    if (!updated) throw new NotFoundException('Term not found');
    return updated;
  }

  async remove(id: string) {
    const result = await this.termsModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Term not found');
    return { message: 'Deleted successfully' };
  }

  async generateTerms(generateTermsDto: GenerateTermsDto): Promise<{ content: string }> {
    const prompt = TERMS_GENERATION_PROMPT(generateTermsDto.keywords);
    const content = await this.aiService.generateAnswer(prompt);
    return { content };
  }
}
