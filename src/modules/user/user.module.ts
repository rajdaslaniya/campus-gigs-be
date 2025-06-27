import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { AwsS3Service } from '../shared/aws-s3.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/database/models/user.model';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  providers: [UserService, AwsS3Service],
  exports: [UserService],
})

export class UserModule {}
