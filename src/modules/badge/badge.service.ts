import {
  Injectable,
  NotFoundException,
  HttpStatus,
  ConflictException,
} from '@nestjs/common';
import { CreateBadgeDto, UpdateBadgeDto } from './badge.dto';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class BadgeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBadgeDto) {
    const trimmedDto = {
      ...dto,
      name: dto.name.trim(),
      description: dto.description.trim(),
    };

    const exists = await this.prisma.badge.findFirst({
      where: {
        name: trimmedDto.name,
        is_deleted: false,
      },
    });
    if (exists)
      throw new ConflictException({
        status: HttpStatus.CONFLICT,
        message: 'Badge with this name already exists',
      });

    const badge = await this.prisma.badge.create({
      data: trimmedDto,
    });
    return {
      message: 'Badge created successfully',
      data: badge,
      status: HttpStatus.CREATED,
    };
  }

  async findAll() {
    const badges = await this.prisma.badge.findMany({
      where: { is_deleted: false },
    });
    return {
      message: 'Badges fetched successfully',
      data: badges,
      status: HttpStatus.OK,
    };
  }

  async findOne(id: number) {
    const badge = await this.prisma.badge.findFirst({
      where: { id, is_deleted: false },
    });
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

  async update(id: number, dto: UpdateBadgeDto) {
    const badge = await this.findOne(id).then((res) => res.data);

    const trimmedDto = { ...dto };
    if (trimmedDto.name) {
      trimmedDto.name = trimmedDto.name.trim();
      if (trimmedDto.name.toLowerCase() !== badge.name.toLowerCase()) {
        const exists = await this.prisma.badge.findFirst({
          where: {
            name: trimmedDto.name,
            is_deleted: false,
          },
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

    const updated = await this.prisma.badge.update({
      where: { id, is_deleted: false },
      data: trimmedDto,
    });
    return {
      message: 'Badge updated successfully',
      data: updated,
      status: HttpStatus.OK,
    };
  }

  async softDelete(id: number) {
    const badge = await this.prisma.badge.update({
      where: { id, is_deleted: false },
      data: { is_deleted: true },
    });

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
