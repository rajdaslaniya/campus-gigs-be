import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Terms, TermsSchema } from './terms.schema';
import { TermsService } from './terms.service';
import { TermsController } from './terms.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Terms.name, schema: TermsSchema }])],
  controllers: [TermsController],
  providers: [TermsService],
})
export class TermsModule {}