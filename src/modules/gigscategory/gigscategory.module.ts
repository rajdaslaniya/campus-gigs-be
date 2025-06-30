import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { GigsCategoryService } from './gigscategory.service';
import { GigsCategoryController } from './gigscategory.controller';
import { TireModule } from '../tire/tire.module';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [AuthModule, TireModule, PrismaService],
  controllers: [GigsCategoryController],
  providers: [GigsCategoryService],
  exports: [GigsCategoryService],
})
export class GigsCategoryModule {}
