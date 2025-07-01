import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { GigsQueryParams, PostGigsDto } from './gigs.dto';
import { AwsS3Service } from '../shared/aws-s3.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GigsService {
  constructor(
    private awsS3Service: AwsS3Service,
    private prismaService: PrismaService,
  ) {}

  async create(body: PostGigsDto, file?: Express.Multer.File) {
    let image = '';

    if (file) {
      image = await this.awsS3Service.uploadFile(
        file.buffer,
        file.originalname,
        file.mimetype,
        'gig',
      );
    }

    const { skills, ...rest } = body;

    const gig = await this.prismaService.gigs.create({
      data: {
        ...rest,
        image,
        skills: {
          connect: skills.map((id) => ({ id: Number(id) })),
        },
      },
    });

    return gig;
  }

  async get(query: GigsQueryParams) {
    const { page, pageSize, search } = query;
    const skip = (page - 1) * pageSize;

    const baseQuery: any = {};

    if (search) {
      baseQuery.OR = [
        { title: { $regex: search, mode: 'insensitive' } },
        { description: { $regex: search, mode: 'insensitive' } },
        { keywords: { $in: new RegExp(search, 'i'), mode: 'insensitive' } },
        {
          certifications: { $in: new RegExp(search, 'i'), mode: 'insensitive' },
        },
        { skills: { $in: new RegExp(search, 'i'), mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prismaService.gigs.findMany({
        where: baseQuery,
        skip,
        take: pageSize,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              profile: true,
              professional_interests: true,
              extracurriculars: true,
              certifications: true,
              education: true,
              skills: true,
            },
          },
          skills: true,
        },
      }),
      this.prismaService.gigs.count({ where: baseQuery }),
    ]);

    const totalPages = Math.ceil(total / pageSize);
    const meta = { page, pageSize, total, totalPages };

    return { data: items, meta, message: 'Gigs fetch successfully' };
  }

  async findById(id: number) {
    return await this.prismaService.gigs.findUnique({ where: { id: id } });
  }

  async put(id: number, body: PostGigsDto, file?: Express.Multer.File) {
    const findGigs = await this.prismaService.gigs.findUnique({
      where: { id: id },
    });
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

    const updateGigs = await this.prismaService.gigs.update({
      where: { id: id },
      data: {
        ...body,
        skills: {
          connect: body.skills.map((skillId) => ({ id: skillId })),
        },
      },
    });

    return { message: 'Gigs updated successfully', data: updateGigs };
  }

  async delete(id: number) {
    const findGigs = await this.prismaService.gigs.findUnique({
      where: { id: id },
    });
    if (!findGigs) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'Gigs not found',
      });
    }

    await this.prismaService.gigs.delete({ where: { id: id } });
    return { message: 'Gigs deleted successfully', data: null };
  }
}
