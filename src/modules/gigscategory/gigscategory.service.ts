import {
  BadRequestException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GIGS_CATEGORY_MODEL, GigsCategory } from './gigscategory.schema';
import { GigsCategoryDto, GigsCategoryQueryParams } from './gigscategory.dto';

@Injectable()
export class GigsCategoryService {
  constructor(
    @InjectModel(GIGS_CATEGORY_MODEL)
    private gigsCategoryModel: Model<GigsCategory>,
  ) {}

  async create(body: GigsCategoryDto) {
    const findSameName = await this.gigsCategoryModel.findOne({
      name: body.name,
    });
    if (findSameName) {
      throw new BadRequestException({
        status: HttpStatus.CONFLICT,
        message: 'The name is already been taken',
      });
    }
    return await this.gigsCategoryModel.create(body);
  }

  async get(query: GigsCategoryQueryParams) {
    const {
      page,
      pageSize,
      search,
      sortBy = 'name',
      sortOrder = 'desc',
    } = query;

    const baseQuery: any = {
      $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
    };

    const skip = (page - 1) * pageSize;

    if (search) {
      baseQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const sortOption: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === 'asc' ? 1 : -1,
    };

    const [items, total] = await Promise.all([
      this.gigsCategoryModel
        .find(baseQuery)
        .sort(sortOption)
        .skip(skip)
        .limit(pageSize),
      this.gigsCategoryModel.countDocuments(baseQuery),
    ]);

    const totalPages = Math.ceil(total / pageSize);
    const meta = { page, pageSize, total, totalPages };

    return { data: items, meta };
  }

  async getAll() {
    return this.gigsCategoryModel.find().select("_id name");
  }

  async update(id: string, body: GigsCategoryDto) {
    return await this.gigsCategoryModel.findOneAndUpdate({ _id: id }, body);
  }

  async delete(id: string) {
    return await this.gigsCategoryModel.findOneAndDelete({ _id: id });
  }
}
