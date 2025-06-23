import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TireDto } from './tire.dto';
import { TireService } from './tire.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('tire')
export class TireController {
  constructor(private tireService: TireService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  async createTire(@Body() body: TireDto) {
    return await this.tireService.create(body);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getTire(
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query('searchQuery') query: string,
  ) {
    if (query) {
      const { data, meta } = await this.tireService.search(
        query,
        page,
        pageSize,
      );
      return { data, meta, message: 'Tire fetch successfully' };
    } else {
      const { data, meta } = await this.tireService.get(page, pageSize);
      return { data, meta, message: 'Tire fetch successfully' };
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllTire(
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
  ) {
    const data = await this.tireService.getAll();

    return { data, message: 'Tire fetch successfully' };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put(':id')
  async updateTire(@Param('id') id: string, @Body() body: TireDto) {
    await this.tireService.update(id, body);
    return { message: 'Tire updated successfully' };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async deleteTire(@Param('id') id: string) {
    await this.tireService.delete(id);
    return { message: 'Tire deleted successfully' };
  }
}
