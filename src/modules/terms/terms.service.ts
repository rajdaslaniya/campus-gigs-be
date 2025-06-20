import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Terms, TermsDocument } from './terms.schema';
import { Model } from 'mongoose';
import { CreateTermsDto, UpdateAgreePolicy, UpdateTermsDto } from './terms.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class TermsService {
  constructor(@InjectModel(Terms.name) private termsModel: Model<TermsDocument>, private userService: UserService) {}

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
}
