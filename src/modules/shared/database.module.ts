import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (ConfigService: ConfigService) => {
        const DATABASE_USER = ConfigService.get('DATABASE_USER');
        const DATABASE_PASS = ConfigService.get('DATABASE_PASS');
        const DATABASE_APP_NAME = ConfigService.get('DATABASE_APP_NAME');

        const uri = `mongodb+srv://${DATABASE_USER}:${DATABASE_PASS}@cluster0.oj0txfd.mongodb.net/?retryWrites=true&w=majority&appName=${DATABASE_APP_NAME}`;

        return {
          uri,
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class DatabaseModule {}
