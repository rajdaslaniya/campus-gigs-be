import {
  BadRequestException,
  Body,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tire, TIRE_MODEL } from './tire.schema';
import { Model } from 'mongoose';
import { TireDto, TireQueryParams } from './tire.dto';

@Injectable()
export class TireService {
  constructor(@InjectModel(TIRE_MODEL) private tireModel: Model<Tire>) {}

  async create(body: TireDto) {
    const findSameName = await this.tireModel.findOne({ name: body.name });
    if (findSameName) {
      throw new BadRequestException({
        status: HttpStatus.CONFLICT,
        message: 'The name is already been taken',
      });
    }

    const findTire = await this.tireModel.find({
      categories: { $in: body.categories },
    });

    if (findTire.length > 0) {
      throw new BadRequestException({
        status: HttpStatus.CONFLICT,
        message: 'The category you select which is link with other tire',
      });
    }

    return await this.tireModel.create(body);
  }

  async get(query: TireQueryParams) {
    const {
      page,
      pageSize,
      search,
      sortBy = 'createdAt',
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
      this.tireModel
        .find(baseQuery)
        .sort(sortOption)
        .skip(skip)
        .limit(pageSize)
        .populate('categories'),
      this.tireModel.countDocuments(baseQuery),
    ]);

    const totalPages = Math.ceil(total / pageSize);
    const meta = { page, pageSize, total, totalPages };

    return { data: items, meta };
  }

  async getAll() {
    return this.tireModel.find();
  }

  async update(id: string, body: TireDto) {
    const findSameName = await this.tireModel.findOne({ name: body.name });
    if (findSameName) {
      throw new BadRequestException({
        status: HttpStatus.CONFLICT,
        message: 'The name is already been taken',
      });
    }

    const findTire = await this.tireModel.find({
      categories: { $in: body.categories },
    });

    if (findTire.length > 0) {
      throw new BadRequestException({
        status: HttpStatus.CONFLICT,
        message: 'The category you select which is link with other tire',
      });
    }

    return await this.tireModel.findOneAndUpdate({ _id: id }, body);
  }

  async delete(id: string) {
    return await this.tireModel.findOneAndDelete({ _id: id });
  }
}
