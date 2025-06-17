import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Badge, BadgeDocument } from './badge.schema';
import { CreateBadgeDto, UpdateBadgeDto } from './badge.dto';
@Injectable()
export class BadgeService {
  constructor(
    @InjectModel(Badge.name) private readonly badgeModel: Model<BadgeDocument>,
  ) {}

  async create(dto: CreateBadgeDto) {
    const trimmedDto = {
      ...dto,
      name: dto.name.trim(),
      description: dto.description.trim(),
    };

    const exists = await this.badgeModel.findOne({
      name: { $regex: `^${trimmedDto.name}$`, $options: 'i' },
      is_deleted: false,
    });
    if (exists) throw new BadRequestException('Badge name must be unique');

    const badge = new this.badgeModel(trimmedDto);
    const saved = await badge.save();
    return {
      message: 'Badge created successfully',
      data: saved,
    };
  }

  async findAll() {
    const badges = await this.badgeModel.find({ is_deleted: false });
    return {
      message: 'Badges fetched successfully',
      data: badges,
    };
  }

  async findOne(id: string) {
    const badge = await this.badgeModel.findOne({ _id: id, is_deleted: false });
    if (!badge) throw new NotFoundException('Badge not found');
    return {
      message: 'Badge fetched successfully',
      data: badge,
    };
  }

  async update(id: string, dto: UpdateBadgeDto) {
    const badge = await this.findOne(id).then((res) => res.data);

    const trimmedDto = { ...dto };
    if (trimmedDto.name) {
      trimmedDto.name = trimmedDto.name.trim();
      if (trimmedDto.name.toLowerCase() !== badge.name.toLowerCase()) {
        const exists = await this.badgeModel.findOne({
          name: { $regex: `^${trimmedDto.name}$`, $options: 'i' },
          _id: { $ne: id },
          is_deleted: false,
        });
        if (exists) throw new BadRequestException('Badge name must be unique');
      }
    }

    if (trimmedDto.description) {
      trimmedDto.description = trimmedDto.description.trim();
    }

    Object.assign(badge, trimmedDto);
    const updated = await badge.save();
    return {
      message: 'Badge updated successfully',
      data: updated,
    };
  }

  async softDelete(id: string) {
    const badge = await this.findOne(id).then((res) => res.data);

    badge.is_deleted = true;
    await badge.save();
    return {
      message: 'Badge deleted successfully',
    };
  }
}
