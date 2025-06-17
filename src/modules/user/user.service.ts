import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, USER_MODEL } from './user.schema';
import { Model } from 'mongoose';
import { SignupDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(USER_MODEL) private userModel: Model<User>) {}

  async create(userBody: SignupDto) {
    const user = await this.userModel.create(userBody);
    return user.save();
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email: email }).exec();
  }
}
