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
  UseGuards,
} from '@nestjs/common';
import { GigsQueryParams, PostGigsDto } from './gigs.dto';
import { GigsService } from './gigs.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { UserFromToken } from '../shared/userFromToken.service';
import { Request } from 'express';

@Controller('gigs')
@UseGuards(JwtAuthGuard)
export class GigsController {
  constructor(
    private gigsService: GigsService,
    private userFromToken: UserFromToken,
  ) {}

  @Post()
  async createGigs(@Body() body: PostGigsDto, @Req() request: Request) {
    const userId = await this.userFromToken.getUserIdFromToken(request);
    const newBody = {
      ...body,
      user: userId,
    };
    return this.gigsService.create(newBody);
  }

  @Get()
  getGigs(@Query() query: GigsQueryParams) {
    return this.gigsService.get(query);
  }

  @Put(':id')
  putGigs(@Param('id') id: string, @Body() body: PostGigsDto) {
    return this.gigsService.put(id, body);
  }

  @Delete(':id')
  deleteGigs(@Param('id') id: string) {
    return this.gigsService.delete(id);
  }
}
