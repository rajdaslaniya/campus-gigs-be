import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { ProfileService } from './profile.service';
import { ProfileUpdateDto } from './profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/utils/multer';

@Controller('user/profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(@Inject() private profileService: ProfileService) {}

  @Get(':id')
  getProfile(@Param('id') id: string) {
    return this.profileService.getProfile(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  updateProfile(
    @Param('id') id: string,
    @Body() body: ProfileUpdateDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.profileService.updateProfile(id, body, file);
  }
}
