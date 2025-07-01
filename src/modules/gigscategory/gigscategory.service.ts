import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GigsCategoryDto, GigsCategoryQueryParams } from './gigscategory.dto';
import { TireService } from '../tire/tire.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GigsCategoryService {
  constructor(
    private tireTireService: TireService,
    private prismaService: PrismaService,
  ) {}

  async create(body: GigsCategoryDto) {
    const findSameName = await this.prismaService.gigsCategory.findFirst({
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

    const findTire = await this.tireTireService.findById(body.tire_id);
    if (!findTire) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'Tire not found',
      });
    }

    return await this.prismaService.gigsCategory.create({
      data: body,
    });
  }

  async get(query: GigsCategoryQueryParams) {
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
      const searchTerm = search.toLowerCase();
      baseQuery.OR = [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        {
          tire: {
            name: { contains: searchTerm, mode: 'insensitive' },
          },
        },
      ];
    }

    const [items, total] = await Promise.all([
      this.prismaService.gigsCategory.findMany({
        where: baseQuery,
        orderBy:
          sortKey === 'tire'
            ? { tire: { name: sortOrder } }
            : { [sortKey]: sortOrder },
        skip,
        take: pageSize,
        include: {
          tire: true,
        },
      }),
      this.prismaService.gigsCategory.count({ where: baseQuery }),
    ]);

    const totalPages = Math.ceil(total / pageSize);
    const meta = { page, pageSize, total, totalPages };

    return { data: items, meta };
  }

  async getAll() {
    return this.prismaService.gigsCategory.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  async update(id: number, body: GigsCategoryDto) {
    const findSameName = await this.prismaService.gigsCategory.findFirst({
      where: {
        id: id,
        name: body.name,
      },
    });
    if (findSameName) {
      throw new BadRequestException({
        status: HttpStatus.CONFLICT,
        message: 'The name is already been taken',
      });
    }

    const findTire = await this.tireTireService.findById(body.tire_id);
    if (!findTire) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'Tire not found',
      });
    }

    return await this.prismaService.gigsCategory.update({
      where: { id: id },
      data: body,
    });
  }

  async delete(id: number) {
    return await this.prismaService.gigsCategory.delete({
      where: { id: id },
    });
  }

  async getAllIdsByName(search: string) {
    let categoryIds: number[] = [];

    const baseQuery: any = {};
    if (search) {
      baseQuery.OR = [{ name: { $regex: search, mode: 'insensitive' } }];
    }

    const matchingCategories = await this.prismaService.gigsCategory.findMany({
      where: {
        name: baseQuery,
      },
    });

    categoryIds = matchingCategories.map((cat) => cat.id);

    return categoryIds;
  }
}
