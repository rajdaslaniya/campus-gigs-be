import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PostGigsDto } from './gigs.dto';
import { GigsService } from './gigs.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';

@Controller('gigs')
@UseGuards(JwtAuthGuard)
export class GigsController {
  constructor(private gigsService: GigsService) {}

  @Post()
  createGigs(@Body() body: PostGigsDto) {
    return this.gigsService.create(body);
  }

  @Get()
  getGigs() {
    return this.gigsService.get();
  }
}
