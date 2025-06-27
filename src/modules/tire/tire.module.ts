import { Module } from '@nestjs/common';
import { TireService } from './tire.service';
import { TireController } from './tire.controller';
import { TIRE_MODEL, tireSchema } from './tire.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { GigsCategoryModule } from '../gigscategory/gigscategory.module';

const TIRE_MODELS = [{ name: TIRE_MODEL, schema: tireSchema }];

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature(TIRE_MODELS),
  ],
  controllers: [TireController],
  providers: [TireService],
  exports: [TireService],
})
export class TireModule {}
