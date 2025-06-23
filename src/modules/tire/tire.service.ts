import { Body, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tire, TIRE_MODEL } from './tire.schema';
import { Model } from 'mongoose';
import { TireDto } from './tire.dto';

@Injectable()
export class TireService {
  constructor(@InjectModel(TIRE_MODEL) private tireModel: Model<Tire>) {}

  async create(body: TireDto) {
    return await this.tireModel.create(body);
  }

  async get(page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;

    const [items, total] = await Promise.all([
      this.tireModel
        .find()
        .sort({ createdAt: -1 })
        .sort()
        .skip(skip)
        .limit(pageSize),
      this.tireModel.countDocuments(),
    ]);

    const totalPages = Math.ceil(total / pageSize);

    const meta = { page, pageSize, total, totalPages };

    return { data: items, meta };
  }

  async search(query: string, page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;

    const searchQuery = {
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ],
    };

    const [items, total] = await Promise.all([
      this.tireModel
        .find(searchQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize),
      this.tireModel.countDocuments(searchQuery),
    ]);

    const totalPages = Math.ceil(total / pageSize);
    const meta = { page, pageSize, total, totalPages };

    return { data: items, meta };
  }

  async getAll() {
    return this.tireModel.find();
  }

  async update(id: string, body: TireDto) {
    return await this.tireModel.findOneAndUpdate({ _id: id }, body);
  }

  async delete(id: string) {
    return await this.tireModel.findOneAndDelete({ _id: id });
  }
}
