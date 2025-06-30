import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { GigsCategoryService } from './gigscategory.service';
import { GigsCategoryController } from './gigscategory.controller';
import { TireModule } from '../tire/tire.module';

@Module({
  imports: [AuthModule, TireModule],
  controllers: [GigsCategoryController],
  providers: [GigsCategoryService],
  exports: [GigsCategoryService],
})
export class GigsCategoryModule {}
