import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { USER_MODEL, userSchema } from './user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AwsS3Service } from '../shared/aws-s3.service';

const USER_MODELS = [{ name: USER_MODEL, schema: userSchema }];

@Module({
  imports: [MongooseModule.forFeature(USER_MODELS)],
  providers: [UserService, AwsS3Service],
  exports: [UserService],
})

export class UserModule {}
