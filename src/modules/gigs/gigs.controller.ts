import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GigsQueryParams, PostGigsDto } from './gigs.dto';
import { GigsService } from './gigs.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { UserFromToken } from '../shared/userFromToken.service';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/utils/multer';

@Controller('gigs')
@UseGuards(JwtAuthGuard)
export class GigsController {
  constructor(
    private gigsService: GigsService,
    private userFromToken: UserFromToken,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async createGigs(
    @Body() body: PostGigsDto,
    @Req() request: Request,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const userId = await this.userFromToken.getUserIdFromToken(request);
    const newBody = {
      ...body,
      user: userId,
    };
    return this.gigsService.create(newBody, image);
  }

  @Get()
  getGigs(@Query() query: GigsQueryParams) {
    return this.gigsService.get(query);
  }

  @Get(":id")
  getGigById(@Param("id") id: string) {
    return this.gigsService.findById(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  putGigs(
    @Param('id') id: string,
    @Body() body: PostGigsDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.gigsService.put(id, body, image);
  }

  @Delete(':id')
  deleteGigs(@Param('id') id: string) {
    return this.gigsService.delete(id);
  }
}
