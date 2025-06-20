import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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
  async getAllTire() {
    return await this.tireService.getAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put(':id')
  async updateTire(@Param('id') id: string, @Body() body: TireDto) {
    await this.tireService.update(id, body);
    return { data: { message: 'Tire updated successfully' } };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async deleteTire(@Param('id') id: string) {
    await this.tireService.delete(id);
    return { data: { message: 'Tire deleted successfully' } };
  }
}
