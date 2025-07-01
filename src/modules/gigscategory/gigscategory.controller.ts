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
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { GigsCategoryService } from './gigscategory.service';
import { GigsCategoryDto, GigsCategoryQueryParams } from './gigscategory.dto';

@Controller('gig-category')
@UseGuards(JwtAuthGuard)
export class GigsCategoryController {
  constructor(private gigsCategoryService: GigsCategoryService) {}

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Post()
  async createGigsCategory(@Body() body: GigsCategoryDto) {
    return await this.gigsCategoryService.create(body);
  }

  @Get()
  async getGigsCategory(@Query() query: GigsCategoryQueryParams) {
    const { data, meta } = await this.gigsCategoryService.get(query);
    return { data, meta, message: 'Gig category fetch successfully' };
  }

  @Get('dropdown')
  async getDropdownGigsCategory() {
    const resp = await this.gigsCategoryService.getAll();

    const data = resp.map((data) => {
      return { id: data.id, label: data.name };
    });

    return { data, message: 'Gig category fetch successfully' };
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Put(':id')
  async updateGigsCategory(
    @Param('id') id: string,
    @Body() body: GigsCategoryDto,
  ) {
    await this.gigsCategoryService.update(Number(id), body);
    return { message: 'Gig category updated successfully' };
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Delete(':id')
  async deleteGigsCategory(@Param('id') id: string) {
    await this.gigsCategoryService.delete(Number(id));
    return { message: 'Gig category deleted successfully' };
  }
}
