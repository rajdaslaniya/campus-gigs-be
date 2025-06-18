import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { UserService } from '../user/user.service';
import { ProfileService } from './profile.service';

@Controller('user/profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(@Inject() private profileService: ProfileService) {}

  @Get(':id')
  getProfile(@Param("id") id: string) {
    return this.profileService.getProfile(id);
  }
}
