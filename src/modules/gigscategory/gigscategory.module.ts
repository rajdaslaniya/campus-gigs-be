import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { GigsCategoryService } from './gigscategory.service';
import { GigsCategoryController } from './gigscategory.controller';
import { GIGS_CATEGORY_MODEL, gigsCategorySchema } from './gigscategory.schema';

const TIRE_MODELS = [{ name: GIGS_CATEGORY_MODEL, schema: gigsCategorySchema }];

@Module({
  imports: [AuthModule, MongooseModule.forFeature(TIRE_MODELS)],
  controllers: [GigsCategoryController],
  providers: [GigsCategoryService],
  exports: [GigsCategoryService],
})
export class GigsCategoryModule {}
