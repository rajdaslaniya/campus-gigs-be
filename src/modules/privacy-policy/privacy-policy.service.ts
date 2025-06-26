import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PrivacyPolicy, PrivacyPolicyDocument } from './privacy-policy.schema';
import { Model } from 'mongoose';
import { CreatePrivacyPolicyDto, UpdatePrivacyPolicyDto, GeneratePrivacyPolicyDto } from './privacy-policy.dto';
import { AiService } from '../faqs/ai.service';
import { PRIVACY_POLICY_GENERATION_PROMPT } from '../../utils/helper';

@Injectable()
export class PrivacyPolicyService {
  constructor(
    @InjectModel(PrivacyPolicy.name) private privacyPolicyModel: Model<PrivacyPolicyDocument>,
    private readonly aiService: AiService,
  ) {}

  async create(createDto: CreatePrivacyPolicyDto) {
    return this.privacyPolicyModel.create(createDto);
  }

  async findAll() {
    return this.privacyPolicyModel.find();
  }

  async findOne(id: string) {
    const policy = await this.privacyPolicyModel.findById(id);
    if (!policy) throw new NotFoundException('Privacy Policy not found');
    return policy;
  }

  async update(id: string, updateDto: UpdatePrivacyPolicyDto) {
    const updated = await this.privacyPolicyModel.findByIdAndUpdate(id, updateDto, { new: true });
    if (!updated) throw new NotFoundException('Privacy Policy not found');
    return updated;
  }

  async remove(id: string) {
    const result = await this.privacyPolicyModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Privacy Policy not found');
    return { message: 'Deleted successfully' };
  }

  async generatePrivacyPolicy(generatePrivacyPolicyDto: GeneratePrivacyPolicyDto): Promise<{ content: string }> {
    const prompt = PRIVACY_POLICY_GENERATION_PROMPT(generatePrivacyPolicyDto.keywords);
    const content = await this.aiService.generateAnswer(prompt);
    return { content };
  }
} 