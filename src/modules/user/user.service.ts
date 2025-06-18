import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, USER_MODEL } from './user.schema';
import { Model } from 'mongoose';
import { SignupDto } from './user.dto';
import { AwsS3Service } from '../shared/aws-s3.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(USER_MODEL) private userModel: Model<User>,
    private awsS3Service: AwsS3Service,
  ) {}

  async create(userBody: SignupDto, file?: Express.Multer.File) {
    let profile: string = "";

    if (file) {
      profile = await this.awsS3Service.uploadProfileFile(
        file.buffer,
        file.originalname,
        file.mimetype,
      );
    }

    const user = await this.userModel.create({
      ...userBody,
      profile,
    });

    return user.save();
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email: email }).exec();
  }

  async findById(id: string) {
    return await this.userModel.findOne({ _id: id }).exec();
  }
}
