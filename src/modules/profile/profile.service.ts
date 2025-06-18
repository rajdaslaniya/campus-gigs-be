import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ProfileUpdateDto } from './profile.dto';

@Injectable()
export class ProfileService {
  constructor(@Inject() private userService: UserService) {}

  async getProfile(id: string) {
    return await this.userService.findById(id);
  }

  async updateProfile(
    id: string,
    body: ProfileUpdateDto,
    file: Express.Multer.File,
  ) {
    const user = await this.userService.findById(id);

    if (!user) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'User not found',
      });
    }

    return this.userService.updateUser(id, body, file);
  }
}
