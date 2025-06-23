import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { GigsQueryParams, PostGigsDto } from './gigs.dto';
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
  getGigs(@Query() query: GigsQueryParams) {
    return this.gigsService.get(query);
  }

  @Put(":id")
  putGigs(@Param("id") id: string, @Body() body: PostGigsDto) {
    return this.gigsService.put(id, body);
  }

  @Delete(":id")
  deleteGigs(@Param("id") id: string) {
    return this.gigsService.delete(id);
  }
}
