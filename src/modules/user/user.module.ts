import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { USER_MODEL, UserSchema } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';

const USER_MODELS = [{ name: USER_MODEL, schema: UserSchema }];

@Module({
  imports: [MongooseModule.forFeature(USER_MODELS)],
  controllers: [UserController],
  providers: [UserService],
  exports: [],
})

export class UserModule {}
