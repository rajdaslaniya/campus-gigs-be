import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { USER_MODEL } from './schemas/user.schema';
import { Model } from 'mongoose';
import { UserBody } from './user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(USER_MODEL) private userModel: Model<any>) {}
  
  createUser(userBody: UserBody) {
    const user = this.userModel.create(userBody);
    return user;
  }
}
