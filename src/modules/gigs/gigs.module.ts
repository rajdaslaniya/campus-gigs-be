import { Module } from '@nestjs/common';
import { GigsController } from './gigs.controller';
import { GigsService } from './gigs.service';
import { AuthModule } from '../auth/auth.module';
import { GIGS_MODEL, gigsSchema } from './gigs.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module';

const GIGS_MODELS = [{ name: GIGS_MODEL, schema: gigsSchema }];

@Module({
  imports: [AuthModule, UserModule, MongooseModule.forFeature(GIGS_MODELS)],
  controllers: [GigsController],
  providers: [GigsService],
  exports: [],
})
export class GigsModule {}
