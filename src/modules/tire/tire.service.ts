import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { TireDto, TireQueryParams } from './tire.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TireService {
  constructor(
    private prismaService: PrismaService,
  ) {}

  async create(body: TireDto) {
    const findSameName = await this.prismaService.tire.findFirst({
      where: {
        name: body.name,
      },
    });
    if (findSameName) {
      throw new BadRequestException({
        status: HttpStatus.CONFLICT,
        message: 'The name is already been taken',
      });
    }

    return await this.prismaService.tire.create({
      data: body,
    });
  }

  async get(query: TireQueryParams) {
    const {
      page,
      pageSize,
      search,
      sortKey = 'name',
      sortOrder = 'desc',
    } = query;

    const baseQuery: any = {};

    const skip = (page - 1) * pageSize;

    if (search) {
      baseQuery.OR = [
        { name: { $regex: search, mode: 'insensitive' } },
        { description: { $regex: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prismaService.tire.findMany({
        where: baseQuery,
        orderBy: { [sortKey]: sortOrder === 'asc' ? 'asc' : 'desc' },
        skip,
        take: pageSize,
      }),
      this.prismaService.tire.count({ where: baseQuery }),
    ]);

    const totalPages = Math.ceil(total / pageSize);
    const meta = { page, pageSize, total, totalPages };

    return { data: items, meta };
  }

  async getDropdownTire() {
    return this.prismaService.tire.findMany();
  }

  async update(id: number, body: TireDto) {
    const findSameName = await this.prismaService.tire.findFirst({
      where: { id: id, name: body.name },
    });
    if (!findSameName) {
      throw new BadRequestException({
        status: HttpStatus.CONFLICT,
        message: 'The name is already been taken',
      });
    }

    return await this.prismaService.tire.update({
      where: { id: id },
      data: body,
    });
  }

  async delete(id: number) {
    return await this.prismaService.tire.delete({
      where: { id: id },
    });
  }

  async findById(id: number) {
    return await this.prismaService.tire.findUnique({ where: { id: id } });
  }
}
