import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { USER_MODEL, UserSchema } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggingMiddleware } from 'src/middlewares/logging.middleware';

const USER_MODELS = [{ name: USER_MODEL, schema: UserSchema }];

@Module({
  imports: [MongooseModule.forFeature(USER_MODELS)],
  controllers: [UserController],
  providers: [UserService],
  exports: [],
})

export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
