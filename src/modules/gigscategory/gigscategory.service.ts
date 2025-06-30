import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GIGS_CATEGORY_MODEL, GigsCategory } from './gigscategory.schema';
import { GigsCategoryDto, GigsCategoryQueryParams } from './gigscategory.dto';
import { TireService } from '../tire/tire.service';

@Injectable()
export class GigsCategoryService {
  constructor(
    @InjectModel(GIGS_CATEGORY_MODEL)
    private gigsCategoryModel: Model<GigsCategory>,
    private tireTireService: TireService,
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

    const findTire = await this.tireTireService.findById(body.tire);
    if (!findTire) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'Tire not found',
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
        { tire: { $regex: search, $options: 'i' } },
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
        .limit(pageSize)
        .populate('tire'),
      this.gigsCategoryModel.countDocuments(baseQuery),
    ]);

    const totalPages = Math.ceil(total / pageSize);
    const meta = { page, pageSize, total, totalPages };

    return { data: items, meta };
  }

  async getAll() {
    return this.gigsCategoryModel.find().select('_id name');
  }

  async update(id: string, body: GigsCategoryDto) {
    const findSameName = await this.gigsCategoryModel.findOne({
      _id: id,
      name: body.name,
    });
    if (findSameName) {
      throw new BadRequestException({
        status: HttpStatus.CONFLICT,
        message: 'The name is already been taken',
      });
    }

    const findTire = await this.tireTireService.findById(body.tire);
    if (!findTire) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'Tire not found',
      });
    }

    return await this.gigsCategoryModel.findOneAndUpdate({ _id: id }, body);
  }

  async delete(id: string) {
    return await this.gigsCategoryModel.findOneAndDelete({ _id: id });
  }

  async getAllIdsByName(search: string) {
    let categoryIds: string[] = [];

    const matchingCategories = await this.gigsCategoryModel.find({
      name: { $regex: search, $options: 'i' },
    });

    categoryIds = matchingCategories.map((cat) => cat._id) as string[];

    return categoryIds;
  }
}
