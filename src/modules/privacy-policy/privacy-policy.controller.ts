import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { PrivacyPolicyService } from './privacy-policy.service';
import { CreatePrivacyPolicyDto, UpdatePrivacyPolicyDto } from './privacy-policy.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('privacy-policy')
export class PrivacyPolicyController {
  constructor(private readonly privacyPolicyService: PrivacyPolicyService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() dto: CreatePrivacyPolicyDto) {
    return this.privacyPolicyService.create(dto);
  }

  @Get()
  findAll() {
    return this.privacyPolicyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.privacyPolicyService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() dto: UpdatePrivacyPolicyDto) {
    return this.privacyPolicyService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.privacyPolicyService.remove(id);
  }
} 