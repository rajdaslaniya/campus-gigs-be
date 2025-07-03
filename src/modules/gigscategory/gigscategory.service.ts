import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GigsCategoryDto } from './gigscategory.dto';
import { TireService } from '../tire/tire.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GigsCategoryService {
  constructor(
    private tireTireService: TireService,
    private prismaService: PrismaService,
  ) { }

  async create(body: GigsCategoryDto) {
    const { name, description, tire_id, skillIds } = body;
    const findSameName = await this.prismaService.gigsCategory.findFirst({ where: { name } });
    if (findSameName) {
      throw new BadRequestException({ message: 'Category name already exists' });
    }

    const tire = await this.tireTireService.findById(body.tire_id);
    if (!tire) {
      throw new NotFoundException({ message: 'Tire not found' });
    }

    const skills = await this.prismaService.skills.findMany({
      where: {
        id: { in: skillIds },
        categoryId: null,
      },
    });

    if (skills.length !== skillIds.length) {
      throw new BadRequestException({ message: 'Some skills are already used in other categories' });
    }

    const category = await this.prismaService.gigsCategory.create({
      data: { name, description, tire_id },
    });

    await this.prismaService.skills.updateMany({
      where: { id: { in: skillIds } },
      data: { categoryId: category.id },
    });

    return { data: category, message: 'Category created successfully' };
  }

  async update(id: number, body: GigsCategoryDto) {
    const existing = await this.prismaService.gigsCategory.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException({ message: 'Category not found' });

    const { name, description, tire_id, skillIds } = body;

    const duplicate = await this.prismaService.gigsCategory.findFirst({
      where: { id: { not: id }, name },
    });
    if (duplicate) throw new BadRequestException({ message: 'Category name already exists' });


    const tire = await this.prismaService.tire.findUnique({ where: { id: tire_id } });
    if (!tire) throw new NotFoundException({ message: 'Tire not found' });

    const validSkills = await this.prismaService.skills.findMany({
      where: {
        id: { in: skillIds },
        OR: [
          { categoryId: null },
          { categoryId: id },
        ],
      },
    });

    if (validSkills.length !== skillIds.length) {
      throw new BadRequestException({ message: 'Some skills are used in other categories' });
    }

    await this.prismaService.gigsCategory.update({
      where: { id },
      data: { name, description, tire_id },
    });

    // Reset previous skills
    await this.prismaService.skills.updateMany({
      where: { categoryId: id },
      data: { categoryId: null },
    });

    // Reassign new skills
    await this.prismaService.skills.updateMany({
      where: { id: { in: skillIds } },
      data: { categoryId: id },
    });

    return { message: 'Category updated successfully' };

  }

  async delete(id: number) {
    return await this.prismaService.gigsCategory.update({
      where: { id },
      data: {
        is_deleted: true,
      },
    });
  }

  // async getAllIdsByName(search: string) {
  //   let categoryIds: number[] = [];

  //   const baseQuery: any = {};
  //   if (search) {
  //     baseQuery.OR = [{ name: { $regex: search, mode: 'insensitive' } }];
  //   }

  //   const matchingCategories = await this.prismaService.gigsCategory.findMany({
  //     where: {
  //       name: baseQuery,
  //     },
  //   });

  //   categoryIds = matchingCategories.map((cat) => cat.id);

  //   return categoryIds;
  // }



  // async get(query: GigsCategoryQueryParams) {
  //   const {
  //     page,
  //     pageSize,
  //     search,
  //     sortKey = 'name',
  //     sortOrder = 'desc',
  //   } = query;

  //   const baseQuery: any = {};

  //   const skip = (page - 1) * pageSize;

  //   if (search) {
  //     const searchTerm = search.toLowerCase();
  //     baseQuery.OR = [
  //       { name: { contains: searchTerm, mode: 'insensitive' } },
  //       {
  //         tire: {
  //           name: { contains: searchTerm, mode: 'insensitive' },
  //         },
  //       },
  //     ];
  //   }

  //   const [items, total] = await Promise.all([
  //     this.prismaService.gigsCategory.findMany({
  //       where: baseQuery,
  //       orderBy:
  //         sortKey === 'tire'
  //           ? { tire: { name: sortOrder } }
  //           : { [sortKey]: sortOrder },
  //       skip,
  //       take: pageSize,
  //       include: {
  //         tire: true,
  //       },
  //     }),
  //     this.prismaService.gigsCategory.count({ where: baseQuery }),
  //   ]);

  //   const totalPages = Math.ceil(total / pageSize);
  //   const meta = { page, pageSize, total, totalPages };

  //   return { data: items, meta };
  // }

  async findAll() {
    return await this.prismaService.gigsCategory.findMany({
      include: {
        tire: true,
        skills: true,
      },
    });
  }

  async findById(id: number) {
    const category = await this.prismaService.gigsCategory.findUnique({
      where: { id },
      include: {
        tire: true,
        skills: true,
      },
    });

    if (!category) throw new NotFoundException({ message: 'Category not found' });

    return category;
  }
}
