import { HttpStatus, Injectable, NotFoundException, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Gigs, GIGS_MODEL } from './gigs.schema';
import { Model, Types } from 'mongoose';
import { GigsQueryParams, PostGigsDto } from './gigs.dto';
import { TireService } from '../tire/tire.service';
import { AwsS3Service } from '../shared/aws-s3.service';

@Injectable()
export class GigsService {
  constructor(
    @InjectModel(GIGS_MODEL) private gigsModel: Model<Gigs>,
    private tireService: TireService,
    private awsS3Service: AwsS3Service,
  ) {}

  async create(body: PostGigsDto, file?: Express.Multer.File) {
    const findTire = (await this.tireService.findById(body.tire)) as any;
    let image: string = '';

    if (!findTire) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'Tire not found',
      });
    }

    const isCategory = findTire.categories.find(
      (data: { _id: Types.ObjectId }) =>
        data._id.toString() === body.gig_category,
    );

    if (!isCategory) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'Please select correct gig category',
      });
    }

    if (file) {
      image = await this.awsS3Service.uploadFile(
        file.buffer,
        file.originalname,
        file.mimetype,
        'gig',
      );
    }

    const gig = await this.gigsModel.create({
      ...body,
      image,
    });

    return gig.save();
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
        .populate('tire', 'name description')
        .populate('user', 'name email')
        .populate({
          path: 'tire',
          select: '_id name categories',
          populate: {
            path: 'categories',
            select: '_id name description',
          },
        })
        .populate('gig_category', '_id name description'),
      this.gigsModel.countDocuments(baseQuery),
    ]);

    const totalPages = Math.ceil(total / pageSize);
    const meta = { page, pageSize, total, totalPages };

    return { data: items, meta, message: 'Gigs fetch successfully' };
  }

  async findById(id: string) {
    return await this.gigsModel
      .findById(id)
      .populate('tire', 'name description')
      .populate('user', 'name email')
      .populate({
        path: 'tire',
        select: '_id name categories',
        populate: {
          path: 'categories',
          select: '_id name description',
        },
      })
      .populate('gig_category', '_id name description');
  }

  async put(id: string, body: PostGigsDto, file?: Express.Multer.File) {
    const findGigs = await this.gigsModel.findOne({ _id: id });
    if (!findGigs) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'Gigs not found',
      });
    }

    if (file) {
      if (findGigs.image) {
        const key = this.awsS3Service.getKeyFromUrl(findGigs.image);
        await this.awsS3Service.deleteFile(key);
      }

      const newProfileUrl = await this.awsS3Service.uploadFile(
        file.buffer,
        file.originalname,
        file.mimetype,
        'gig',
      );
      body['image'] = newProfileUrl;
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
