import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { AwsS3Service } from '../shared/aws-s3.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [UserService, AwsS3Service],
  exports: [UserService],
})
export class UserModule {}
