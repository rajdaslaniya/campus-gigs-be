import {
  Body,
  Controller,
  Get,
  Inject,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { ProfileService } from './profile.service';
import { ProfileUpdateDto } from './profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/utils/multer';
import { Request } from 'express';
import { UserFromToken } from '../shared/userFromToken.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('user/profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(
    @Inject() private profileService: ProfileService,
    @Inject() private userFromToken: UserFromToken,
  ) {}

  @Get('')
  getProfile(@Req() request: Request) {
    const userId = this.userFromToken.getUserIdFromToken(request);
    return this.profileService.getProfile(userId);
  }

  @Put('')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  updateProfile(
    @Req() request: Request,
    @Body() body: ProfileUpdateDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = this.userFromToken.getUserIdFromToken(request);
    return this.profileService.updateProfile(userId, body, file);
  }
}
