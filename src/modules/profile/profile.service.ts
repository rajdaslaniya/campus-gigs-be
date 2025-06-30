import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ProfileUpdateDto } from './profile.dto';
import { excludeFromObject } from 'src/utils/helper';

@Injectable()
export class ProfileService {
  constructor(@Inject() private userService: UserService) {}

  async getProfile(id: string) {
    const userdata = await this.userService.findById(Number(id));
    return excludeFromObject(userdata, ['password'])
  }

  async updateProfile(
    id: string,
    body: ProfileUpdateDto,
    file: Express.Multer.File,
  ) {
    const user = await this.userService.findById(Number(id));

    if (!user) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'User not found',
      });
    }

    const updatedUser = await this.userService.updateUser(Number(id), body, file);

    return excludeFromObject(updatedUser, ['password']);
  }
}
