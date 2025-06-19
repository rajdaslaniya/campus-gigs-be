import {
  Injectable,
  NotFoundException,
  HttpStatus,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Badge, BadgeDocument } from './badge.schema';
import { CreateBadgeDto, UpdateBadgeDto } from './badge.dto';
@Injectable()
export class BadgeService {
  constructor(
    @InjectModel(Badge.name) private readonly BadgeModel: Model<BadgeDocument>,
  ) {}

  async create(dto: CreateBadgeDto) {
    const trimmedDto = {
      ...dto,
      name: dto.name.trim(),
      description: dto.description.trim(),
    };

    const exists = await this.BadgeModel.findOne({
      name: { $regex: `^${trimmedDto.name}$`, $options: 'i' },
      is_deleted: false,
    });
    if (exists)
      throw new ConflictException({
        status: HttpStatus.CONFLICT,
        message: 'Badge with this name already exists',
      });

    const badge = new this.BadgeModel(trimmedDto);
    const saved = await badge.save();
    return {
      message: 'Badge created successfully',
      data: saved,
      status: HttpStatus.CREATED,
    };
  }

  async findAll() {
    const badges = await this.BadgeModel.find({ is_deleted: false });
    return {
      message: 'Badges fetched successfully',
      data: badges,
      status: HttpStatus.OK,
    };
  }

  async findOne(id: string) {
    const badge = await this.BadgeModel.findOne({ _id: id, is_deleted: false });
    if (!badge)
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'Badge not found',
      });
    return {
      message: 'Badge fetched successfully',
      data: badge,
      status: HttpStatus.OK,
    };
  }

  async update(id: string, dto: UpdateBadgeDto) {
    const badge = await this.findOne(id).then((res) => res.data);

    const trimmedDto = { ...dto };
    if (trimmedDto.name) {
      trimmedDto.name = trimmedDto.name.trim();
      if (trimmedDto.name.toLowerCase() !== badge.name.toLowerCase()) {
        const exists = await this.BadgeModel.findOne({
          name: { $regex: `^${trimmedDto.name}$`, $options: 'i' },
          _id: { $ne: id },
          is_deleted: false,
        });
        if (exists)
          throw new ConflictException({
            status: HttpStatus.CONFLICT,
            message: 'Badge with this name already exists',
          });
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
      status: HttpStatus.OK,
    };
  }

  async softDelete(id: string) {
    const badge = await this.BadgeModel.findByIdAndUpdate(
      id,
      { is_deleted: true },
      { new: true },
    );

    if (!badge)
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'Badge not found',
      });
    return {
      message: 'Badge deleted successfully',
      data: badge,
      status: HttpStatus.OK,
    };
  }
}
