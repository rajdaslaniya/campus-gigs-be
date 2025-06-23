import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TireDto, TireQueryParams } from './tire.dto';
import { TireService } from './tire.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('tire')
@UseGuards(JwtAuthGuard)
export class TireController {
  constructor(private tireService: TireService) {}

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Post()
  async createTire(@Body() body: TireDto) {
    return await this.tireService.create(body);
  }

  @Get()
  async getTire(
    @Query() query: TireQueryParams
  ) {
    const { data, meta } = await this.tireService.search(query);
    return { data, meta, message: 'Tire fetch successfully' };
  }

  @Get()
  async getAllTire() {
    const data = await this.tireService.getAll();

    return { data, message: 'Tire fetch successfully' };
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Put(':id')
  async updateTire(@Param('id') id: string, @Body() body: TireDto) {
    await this.tireService.update(id, body);
    return { message: 'Tire updated successfully' };
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Delete(':id')
  async deleteTire(@Param('id') id: string) {
    await this.tireService.delete(id);
    return { message: 'Tire deleted successfully' };
  }
}
