import { Inject, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class ProfileService {
  constructor(@Inject() private userService: UserService) {}

  getProfile(id: string) {
    return this.userService.findById(id);
  }
}
