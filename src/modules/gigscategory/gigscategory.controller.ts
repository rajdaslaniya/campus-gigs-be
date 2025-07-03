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
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { GigsCategoryService } from './gigscategory.service';
import { GigsCategoryDto } from './gigscategory.dto';

@Controller('gig-category')
export class GigsCategoryController {
  constructor(private gigsCategoryService: GigsCategoryService) { }

  @Get()
  async getGigsCategory() {
    return this.gigsCategoryService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.gigsCategoryService.findById(+id);
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async createGigsCategory(@Body() body: GigsCategoryDto) {
    return await this.gigsCategoryService.create(body);
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id')
  async updateGigsCategory(
    @Param('id') id: string,
    @Body() body: GigsCategoryDto,
  ) {
    await this.gigsCategoryService.update(Number(id), body);
    return { message: 'Gig category updated successfully' };
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async deleteGigsCategory(@Param('id') id: string) {
    await this.gigsCategoryService.delete(Number(id));
    return { message: 'Gig category deleted successfully' };
  }
}
