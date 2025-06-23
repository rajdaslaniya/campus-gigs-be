import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BadgeService } from './badge.service';
import { BadgeController } from './badge.controller';
import { Badge, BadgeSchema } from './badge.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Badge.name, schema: BadgeSchema }]),
  ],
  controllers: [BadgeController],
  providers: [BadgeService],
})
export class BadgeModule {}
