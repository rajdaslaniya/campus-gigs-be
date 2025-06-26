import { Module } from '@nestjs/common';
import { GigsController } from './gigs.controller';
import { GigsService } from './gigs.service';
import { AuthModule } from '../auth/auth.module';
import { GIGS_MODEL, gigsSchema } from './gigs.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserFromToken } from '../shared/userFromToken.service';
import { TireModule } from '../tire/tire.module';
import { AwsS3Service } from '../shared/aws-s3.service';

const GIGS_MODELS = [{ name: GIGS_MODEL, schema: gigsSchema }];

@Module({
  imports: [AuthModule, TireModule, MongooseModule.forFeature(GIGS_MODELS)],
  controllers: [GigsController],
  providers: [GigsService, UserFromToken, AwsS3Service],
  exports: [],
})
export class GigsModule {}
