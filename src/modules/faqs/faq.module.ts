import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Faq, FaqSchema } from './faq.schema';
import { FaqController } from './faq.controller';
import { FaqService } from './faq.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule, MongooseModule.forFeature([{ name: Faq.name, schema: FaqSchema }])],
  controllers: [FaqController],
  providers: [FaqService],
})
export class FaqModule {}
