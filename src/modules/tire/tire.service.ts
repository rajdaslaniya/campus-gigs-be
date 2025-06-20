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

  async getAll() {
    return await this.tireModel.find();
  }

  async update(id: string, body: TireDto) {
    return await this.tireModel.findOneAndUpdate({ _id: id }, body);
  }

  async delete(id: string) {
    return await this.tireModel.findOneAndDelete({ _id: id });
  }
}
