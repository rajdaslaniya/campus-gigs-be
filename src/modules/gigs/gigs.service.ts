import { HttpStatus, Injectable, NotFoundException, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Gigs, GIGS_MODEL } from './gigs.schema';
import { Model } from 'mongoose';
import { GigsQueryParams, PostGigsDto } from './gigs.dto';

@Injectable()
export class GigsService {
  constructor(@InjectModel(GIGS_MODEL) private gigsModel: Model<Gigs>) {}

  async create(body: PostGigsDto) {
    return await this.gigsModel.create(body);
  }

  async get(query: GigsQueryParams) {
    const { page, pageSize, search } = query;
    const skip = (page - 1) * pageSize;

    const baseQuery: any = {
      $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
    };

    if (search) {
      baseQuery.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { keywords: { $in: new RegExp(search, 'i'), $options: 'i' } },
        { certifications: { $in: new RegExp(search, 'i'), $options: 'i' } },
        { skills: { $in: new RegExp(search, 'i'), $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.gigsModel
        .find(baseQuery)
        .skip(skip)
        .limit(pageSize)
        .populate('tire', "name description")
        .populate('user', "name email"),
      this.gigsModel.countDocuments(baseQuery),
    ]);

    const totalPages = Math.ceil(total / pageSize);
    const meta = { page, pageSize, total, totalPages };

    return { data: items, meta, message: 'Gigs fetch successfully' };
  }

  async put(id: string, body: PostGigsDto) {
    const findGigs = await this.gigsModel.findOne({ _id: id });
    if (!findGigs) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'Gigs not found',
      });
    }

    const updateGigs = await this.gigsModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    return { message: 'Gigs updated successfully', data: updateGigs };
  }

  async delete(id: string) {
    const findGigs = await this.gigsModel.findOne({ _id: id });
    if (!findGigs) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'Gigs not found',
      });
    }

    await this.gigsModel.findByIdAndDelete(id);
    return { message: 'Gigs deleted successfully', data: null };
  }
}
